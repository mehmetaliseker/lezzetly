"use client";

import { FileUpload, type FileUploadSelectEvent } from "primereact/fileupload";

type OwnerProfileImageUploadProps = {
	label: string;
	chooseClass: string;
	inputName: string;
	maxFileSize: number;
	onSelect: (event: FileUploadSelectEvent) => void;
};

export function OwnerProfileImageUpload({
	label,
	chooseClass,
	inputName,
	maxFileSize,
	onSelect,
}: OwnerProfileImageUploadProps) {
	return (
		<div>
			<p className="text-sm font-medium text-stone-200">{label}</p>
			<div className="mt-2">
				<FileUpload
					accept="image/*"
					chooseOptions={{ className: chooseClass }}
					maxFileSize={maxFileSize}
					mode="basic"
					name={inputName}
					onSelect={onSelect}
				/>
			</div>
		</div>
	);
}
