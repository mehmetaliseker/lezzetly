package com.lezzetly.backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.web.multipart.MultipartFile;

import com.lezzetly.backend.domain.ImageBinaryContent;
import com.lezzetly.backend.domain.RestaurantImageKind;
import com.lezzetly.backend.dto.OwnerRestaurantProfileResponse;
import com.lezzetly.backend.dto.RestaurantResponse;
import com.lezzetly.backend.dto.UpdateOwnerRestaurantProfileRequest;

public interface RestaurantService {

	List<RestaurantResponse> listActive();

	RestaurantResponse getById(Long id);

	OwnerRestaurantProfileResponse getOwnerProfile(Long ownerUserId);

	OwnerRestaurantProfileResponse createOwnerProfile(Long ownerUserId, UpdateOwnerRestaurantProfileRequest request);

	OwnerRestaurantProfileResponse updateOwnerProfile(Long ownerUserId, UpdateOwnerRestaurantProfileRequest request);

	void uploadOwnerRestaurantImages(
			Long ownerUserId,
			MultipartFile mainImage,
			MultipartFile detailImage1,
			MultipartFile detailImage2
	);

	Optional<ImageBinaryContent> loadPublicRestaurantImage(Long restaurantId, RestaurantImageKind kind);
}
