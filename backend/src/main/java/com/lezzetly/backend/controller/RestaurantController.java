package com.lezzetly.backend.controller;

import java.util.List;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.lezzetly.backend.domain.RestaurantImageKind;
import com.lezzetly.backend.dto.OwnerRestaurantProfileResponse;
import com.lezzetly.backend.dto.RestaurantResponse;
import com.lezzetly.backend.dto.UpdateOwnerRestaurantProfileRequest;
import com.lezzetly.backend.security.JwtPrincipal;
import com.lezzetly.backend.service.RestaurantService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/restaurants")
@Tag(name = "Restaurants", description = "Restoran listeleme ve detay")
public class RestaurantController {

	private final RestaurantService restaurantService;

	public RestaurantController(RestaurantService restaurantService) {
		this.restaurantService = restaurantService;
	}

	@GetMapping
	@Operation(summary = "Aktif restoranları listele")
	public List<RestaurantResponse> list() {
		return restaurantService.listActive();
	}

	@GetMapping("/{id}")
	@Operation(summary = "Restoran detayı")
	public RestaurantResponse get(@PathVariable Long id) {
		return restaurantService.getById(id);
	}

	@GetMapping("/{id}/images/{segment}")
	@Operation(summary = "Restoran görseli (binary veya kayıtlı blob)")
	public ResponseEntity<byte[]> restaurantImage(@PathVariable Long id, @PathVariable String segment) {
		RestaurantImageKind kind = parseImageSegment(segment);
		return restaurantService.loadPublicRestaurantImage(id, kind)
				.map(content -> ResponseEntity.ok()
						.header(HttpHeaders.CONTENT_TYPE, content.contentType())
						.body(content.data()))
				.orElse(ResponseEntity.notFound().build());
	}

	private static RestaurantImageKind parseImageSegment(String segment) {
		if (segment == null) {
			throw new org.springframework.web.server.ResponseStatusException(HttpStatus.BAD_REQUEST, "Geçersiz görsel");
		}
		return switch (segment.trim().toLowerCase()) {
			case "main" -> RestaurantImageKind.MAIN;
			case "detail1" -> RestaurantImageKind.DETAIL1;
			case "detail2" -> RestaurantImageKind.DETAIL2;
			default -> throw new org.springframework.web.server.ResponseStatusException(HttpStatus.BAD_REQUEST, "Geçersiz görsel");
		};
	}

	@GetMapping("/owner/profile")
	@Operation(summary = "İşletme sahibinin restoran profili")
	public OwnerRestaurantProfileResponse ownerProfile(@AuthenticationPrincipal JwtPrincipal principal) {
		if (principal == null) {
			throw new org.springframework.web.server.ResponseStatusException(HttpStatus.UNAUTHORIZED, "Oturum gerekli");
		}
		return restaurantService.getOwnerProfile(principal.user().userId());
	}

	@PostMapping("/owner/profile")
	@Operation(summary = "İşletme sahibi için restoran profili oluştur")
	public ResponseEntity<OwnerRestaurantProfileResponse> createOwnerProfile(
			@AuthenticationPrincipal JwtPrincipal principal,
			@Valid @RequestBody UpdateOwnerRestaurantProfileRequest request
	) {
		if (principal == null) {
			throw new org.springframework.web.server.ResponseStatusException(HttpStatus.UNAUTHORIZED, "Oturum gerekli");
		}
		OwnerRestaurantProfileResponse created = restaurantService.createOwnerProfile(principal.user().userId(), request);
		return ResponseEntity.status(HttpStatus.CREATED).body(created);
	}

	@PatchMapping("/owner/profile")
	@Operation(summary = "İşletme sahibinin restoran profilini güncelle")
	public OwnerRestaurantProfileResponse updateOwnerProfile(
			@AuthenticationPrincipal JwtPrincipal principal,
			@Valid @RequestBody UpdateOwnerRestaurantProfileRequest request
	) {
		if (principal == null) {
			throw new org.springframework.web.server.ResponseStatusException(HttpStatus.UNAUTHORIZED, "Oturum gerekli");
		}
		return restaurantService.updateOwnerProfile(principal.user().userId(), request);
	}

	@PostMapping(value = "/owner/profile/images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	@Operation(summary = "İşletme görsellerini yükle (ana + en fazla 2 detay)")
	public ResponseEntity<Void> uploadOwnerImages(
			@AuthenticationPrincipal JwtPrincipal principal,
			@RequestPart(value = "mainImage", required = false) MultipartFile mainImage,
			@RequestPart(value = "detailImage1", required = false) MultipartFile detailImage1,
			@RequestPart(value = "detailImage2", required = false) MultipartFile detailImage2
	) {
		if (principal == null) {
			throw new org.springframework.web.server.ResponseStatusException(HttpStatus.UNAUTHORIZED, "Oturum gerekli");
		}
		restaurantService.uploadOwnerRestaurantImages(principal.user().userId(), mainImage, detailImage1, detailImage2);
		return ResponseEntity.noContent().build();
	}
}
