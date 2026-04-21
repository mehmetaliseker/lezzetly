package com.lezzetly.backend.domain;

public record ImageBinaryContent(
		byte[] data,
		String contentType
) {
}
