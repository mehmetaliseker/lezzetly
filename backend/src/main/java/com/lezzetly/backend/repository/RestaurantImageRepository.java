package com.lezzetly.backend.repository;

import java.util.List;

public interface RestaurantImageRepository {

	List<String> findDetailImageUrls(Long restaurantId);

	void replaceDetailImages(Long restaurantId, List<String> detailImageUrls);
}
