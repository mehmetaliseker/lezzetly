package com.lezzetly.backend.repository;

import java.util.Optional;

import com.lezzetly.backend.dto.OwnerRestaurantProfileResponse;
import com.lezzetly.backend.dto.UpdateOwnerRestaurantProfileRequest;

public interface OwnerRestaurantProfileRepository {

	Optional<OwnerRestaurantProfileResponse> findByOwnerUserId(Long ownerUserId);

	OwnerRestaurantProfileResponse insertForOwner(Long ownerUserId, UpdateOwnerRestaurantProfileRequest request);

	OwnerRestaurantProfileResponse updateByOwnerUserId(Long ownerUserId, UpdateOwnerRestaurantProfileRequest request);
}
