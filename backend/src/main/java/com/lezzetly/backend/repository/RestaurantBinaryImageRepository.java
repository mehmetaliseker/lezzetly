package com.lezzetly.backend.repository;

import java.util.Optional;

import com.lezzetly.backend.domain.ImageBinaryContent;
import com.lezzetly.backend.domain.RestaurantImageKind;

public interface RestaurantBinaryImageRepository {

	Optional<ImageBinaryContent> load(Long restaurantId, RestaurantImageKind kind);

	void saveMain(Long restaurantId, byte[] data, String contentType);

	void saveDetail1(Long restaurantId, byte[] data, String contentType);

	void saveDetail2(Long restaurantId, byte[] data, String contentType);

	void clearMain(Long restaurantId);

	void clearDetail1(Long restaurantId);

	void clearDetail2(Long restaurantId);

	boolean hasMainBlob(Long restaurantId);

	boolean hasDetail1Blob(Long restaurantId);

	boolean hasDetail2Blob(Long restaurantId);
}
