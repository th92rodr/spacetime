'use client'

import { type ChangeEvent, useState } from 'react'

export function MediaPicker() {
  const [preview, setPreview] = useState<string | null>(null)

  function onFileSelected(event: ChangeEvent<HTMLInputElement>) {
    const { files } = event.target

    if (!files) {
      return
    }

    const previewUrl = URL.createObjectURL(files[0])

    setPreview(previewUrl)
  }

  return (
    <>
      <input
        id="media"
        name="coverUrl"
        type="file"
        accept="image/*"
        className="invisible h-0 w-0"
        onChange={onFileSelected}
      />

      {preview && (
        <img
          src={preview}
          alt=""
          className="w-full aspect-video rounded-lg object-cover"
        />
      )}
    </>
  )
}
