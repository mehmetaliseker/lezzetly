package com.lezzetly.backend.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import com.lezzetly.backend.domain.ImageBinaryContent;
import com.lezzetly.backend.domain.Restaurant;
import com.lezzetly.backend.domain.RestaurantImageKind;
import com.lezzetly.backend.domain.UserRole;
import com.lezzetly.backend.dto.OwnerRestaurantProfileResponse;
import com.lezzetly.backend.dto.RestaurantResponse;
import com.lezzetly.backend.dto.UpdateOwnerRestaurantProfileRequest;
import com.lezzetly.backend.repository.OwnerRestaurantProfileRepository;
import com.lezzetly.backend.repository.RestaurantBinaryImageRepository;
import com.lezzetly.backend.repository.RestaurantImageRepository;
import com.lezzetly.backend.repository.RestaurantRepository;
import com.lezzetly.backend.repository.RestaurantTableRepository;
import com.lezzetly.backend.repository.UserRepository;

public class DefaultRestaurantService implements RestaurantService {

	private static final long MAX_IMAGE_BYTES = 1_000_000L;

	private final RestaurantRepository restaurantRepository;
	private final RestaurantTableRepository restaurantTableRepository;
	private final RestaurantImageRepository restaurantImageRepository;
	private final RestaurantBinaryImageRepository restaurantBinaryImageRepository;
	private final OwnerRestaurantProfileRepository ownerRestaurantProfileRepository;
	private final UserRepository userRepository;

	public DefaultRestaurantService(
			RestaurantRepository restaurantRepository,
			RestaurantTableRepository restaurantTableRepository,
			RestaurantImageRepository restaurantImageRepository,
			RestaurantBinaryImageRepository restaurantBinaryImageRepository,
			OwnerRestaurantProfileRepository ownerRestaurantProfileRepository,
			UserRepository userRepository
	) {
		this.restaurantRepository = restaurantRepository;
		this.restaurantTableRepository = restaurantTableRepository;
		this.restaurantImageRepository = restaurantImageRepository;
		this.restaurantBinaryImageRepository = restaurantBinaryImageRepository;
		this.ownerRestaurantProfileRepository = ownerRestaurantProfileRepository;
		this.userRepository = userRepository;
	}

	@Override
	public List<RestaurantResponse> listActive() {
		return restaurantRepository.findAllActive().stream()
				.map(this::toResponse)
				.collect(Collectors.toList());
	}

	@Override
	public RestaurantResponse getById(Long id) {
		Restaurant restaurant = restaurantRepository.findById(id)
				.filter(Restaurant::active)
				.orElseThrow(() -> new IllegalArgumentException("Restoran bulunamadı veya pasif: " + id));
		return toResponse(restaurant);
	}

	@Override
	public OwnerRestaurantProfileResponse getOwnerProfile(Long ownerUserId) {
		ensureOwnerRole(ownerUserId);
		return ownerRestaurantProfileRepository.findByOwnerUserId(ownerUserId)
				.orElseGet(() -> new OwnerRestaurantProfileResponse(
						null,
						"",
						"",
						null,
						null,
						null,
						null,
						null,
						null,
						null,
						null,
						List.of()
				));
	}

	@Override
	@Transactional
	public OwnerRestaurantProfileResponse createOwnerProfile(Long ownerUserId, UpdateOwnerRestaurantProfileRequest request) {
		ensureOwnerRole(ownerUserId);
		validateOwnerRestaurantRequest(request);
		if (ownerRestaurantProfileRepository.findByOwnerUserId(ownerUserId).isPresent()) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "İşletme profili zaten mevcut");
		}
		return ownerRestaurantProfileRepository.insertForOwner(ownerUserId, request);
	}

	@Override
	@Transactional
	public OwnerRestaurantProfileResponse updateOwnerProfile(Long ownerUserId, UpdateOwnerRestaurantProfileRequest request) {
		ensureOwnerRole(ownerUserId);
		validateOwnerRestaurantRequest(request);
		if (ownerRestaurantProfileRepository.findByOwnerUserId(ownerUserId).isEmpty()) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "İşletme profili bulunamadı");
		}
		return ownerRestaurantProfileRepository.updateByOwnerUserId(ownerUserId, request);
	}

	@Override
	@Transactional
	public void uploadOwnerRestaurantImages(
			Long ownerUserId,
			MultipartFile mainImage,
			MultipartFile detailImage1,
			MultipartFile detailImage2
	) {
		ensureOwnerRole(ownerUserId);
		OwnerRestaurantProfileResponse profile = ownerRestaurantProfileRepository.findByOwnerUserId(ownerUserId)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "İşletme profili bulunamadı"));
		Long restaurantId = profile.restaurantId();
		if (mainImage != null && !mainImage.isEmpty()) {
			validateImagePart(mainImage);
			try {
				restaurantBinaryImageRepository.saveMain(restaurantId, mainImage.getBytes(), resolveContentType(mainImage));
			} catch (IOException exception) {
				throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Ana görsel okunamadı");
			}
		}
		if (detailImage1 != null && !detailImage1.isEmpty()) {
			validateImagePart(detailImage1);
			try {
				restaurantBinaryImageRepository.saveDetail1(restaurantId, detailImage1.getBytes(), resolveContentType(detailImage1));
			} catch (IOException exception) {
				throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Detay görsel 1 okunamadı");
			}
		}
		if (detailImage2 != null && !detailImage2.isEmpty()) {
			validateImagePart(detailImage2);
			try {
				restaurantBinaryImageRepository.saveDetail2(restaurantId, detailImage2.getBytes(), resolveContentType(detailImage2));
			} catch (IOException exception) {
				throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Detay görsel 2 okunamadı");
			}
		}
	}

	@Override
	public Optional<ImageBinaryContent> loadPublicRestaurantImage(Long restaurantId, RestaurantImageKind kind) {
		Restaurant restaurant = restaurantRepository.findById(restaurantId)
				.filter(Restaurant::active)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Restoran bulunamadı"));
		return switch (kind) {
			case MAIN -> {
				if (restaurantBinaryImageRepository.hasMainBlob(restaurant.id())) {
					yield restaurantBinaryImageRepository.load(restaurant.id(), RestaurantImageKind.MAIN);
				}
				yield Optional.empty();
			}
			case DETAIL1 -> restaurantBinaryImageRepository.load(restaurant.id(), RestaurantImageKind.DETAIL1);
			case DETAIL2 -> restaurantBinaryImageRepository.load(restaurant.id(), RestaurantImageKind.DETAIL2);
		};
	}

	private static void validateOwnerRestaurantRequest(UpdateOwnerRestaurantProfileRequest request) {
		if (request.capacity() == null || request.capacity() <= 0) {
			throw new IllegalArgumentException("Masa sayısı en az 1 olmalıdır");
		}
		if (request.pricePerHour() == null || request.pricePerHour().signum() < 0) {
			throw new IllegalArgumentException("Saatlik ücret negatif olamaz");
		}
	}

	private static void validateImagePart(MultipartFile file) {
		String contentType = file.getContentType();
		if (contentType == null || !contentType.startsWith("image/")) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Yalnızca görsel dosyaları yüklenebilir");
		}
		if (file.getSize() > MAX_IMAGE_BYTES) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Görsel boyutu en fazla 1 MB olabilir");
		}
	}

	private static String resolveContentType(MultipartFile file) {
		String contentType = file.getContentType();
		return contentType != null ? contentType : "application/octet-stream";
	}

	private void ensureOwnerRole(Long ownerUserId) {
		boolean isOwner = userRepository.findById(ownerUserId)
				.map(user -> user.role() == UserRole.OWNER)
				.orElse(false);
		if (!isOwner) {
			throw new IllegalArgumentException("Bu işlem yalnızca işletme sahibi hesapları için geçerlidir");
		}
	}

	private RestaurantResponse toResponse(Restaurant restaurant) {
		List<Integer> tables = restaurantTableRepository.findActiveTableNumbers(restaurant.id());
		Long id = restaurant.id();
		String mainImageUrl = null;
		if (restaurantBinaryImageRepository.hasMainBlob(id)) {
			mainImageUrl = "/api/restaurants/" + id + "/images/main";
		} else if (restaurant.imageUrl() != null && !restaurant.imageUrl().isBlank()) {
			mainImageUrl = restaurant.imageUrl();
		}
		List<String> detailImages = new ArrayList<>();
		if (restaurantBinaryImageRepository.hasDetail1Blob(id)) {
			detailImages.add("/api/restaurants/" + id + "/images/detail1");
		}
		if (restaurantBinaryImageRepository.hasDetail2Blob(id)) {
			detailImages.add("/api/restaurants/" + id + "/images/detail2");
		}
		if (detailImages.isEmpty()) {
			detailImages.addAll(restaurantImageRepository.findDetailImageUrls(id));
		}
		return new RestaurantResponse(
				restaurant.id(),
				restaurant.name(),
				restaurant.city(),
				restaurant.pricePerHour(),
				restaurant.active(),
				tables.size(),
				mainImageUrl,
				detailImages
		);
	}
}
