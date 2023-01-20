import React, { useState } from 'react'
import {
  ReactCompareSlider,
  ReactCompareSliderImage,
} from 'react-compare-slider'
import { Uploader } from 'uploader'
import { UploadButton } from 'react-uploader'
import Pill from './Pill'

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

type Prediction = {
  output: string | null
  status: string
}

type File = {
  fileUrl: string
}

const uploader = Uploader({
  apiKey: import.meta.env.PUBLIC_UPLOAD_IO_API_KEY,
})

const options = {
  maxFileCount: 1,
  mimeTypes: ['image/jpeg', 'image/png', 'image/jpg'],
  editor: { images: { crop: false } },
  styles: { colors: { primary: '#4f46e5' } },
}

function Form() {
  const [prediction, setPrediction] = useState<Prediction>({
    output: null,
    status: '',
  })
  const [error, setError] = useState<string | null>(null)
  const [inputImage, setInputImage] = useState('/input.avif')
  const [outputImage, setOutputImage] = useState('/output.avif')

  async function runPrediction(inputImageUrl: string) {
    setError(null)

    const response = await fetch('/api/prediction', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: inputImageUrl,
      }),
    })

    let prediction = await response.json()
    if (response.status !== 201) {
      setError(prediction.detail)
      return
    }

    setPrediction(prediction)

    while (
      prediction.status !== 'succeeded' &&
      prediction.status !== 'failed'
    ) {
      await sleep(1000)
      const response = await fetch('/api/prediction/' + prediction.id)
      prediction = await response.json()

      if (response.status !== 200) {
        setError(prediction.detail)
        return
      }

      setPrediction(prediction)
    }

    if (prediction.error) {
      setError(prediction.error)
    }

    if (prediction.status === 'succeeded') {
      setInputImage(inputImageUrl)
      setOutputImage(prediction.output)
    }
  }

  function handleImageUploaded(files: File[]) {
    if (files.length > 0) {
      runPrediction(files[0].fileUrl)
    }
  }

  return (
    <div className="flex flex-col items-center">
      <UploadButton
        uploader={uploader}
        options={options}
        onComplete={handleImageUploaded}
      >
        {({ onClick }) => (
          <button
            onClick={onClick}
            className="rounded-lg bg-indigo-600 px-4 text-base font-semibold leading-7 text-white shadow-sm  ring-indigo-600 hover:bg-indigo-700 hover:ring-indigo-700 py-4 flex justify-center"
          >
            Upload an image
          </button>
        )}
      </UploadButton>

      {error && <div>{error}</div>}

      <div className="flex flex-col items-center my-6">
        <div className="flex">
          {prediction.status ? (
            <Pill>
              <span>Status: {prediction.status}</span>
            </Pill>
          ) : null}

          {prediction.status === 'succeeded' ? (
            <Pill className="ml-4">
              <a href={outputImage} target="_blank">
                Download generated image
              </a>
            </Pill>
          ) : null}
        </div>

        {!prediction.status || prediction.output ? (
          <ReactCompareSlider
            itemOne={
              <ReactCompareSliderImage src={inputImage} alt="Input image" />
            }
            itemTwo={
              <div style={{ background: 'url(/checker.svg) repeat' }}>
                <ReactCompareSliderImage src={outputImage} alt="Output image" />
              </div>
            }
          />
        ) : null}
      </div>
    </div>
  )
}

export default Form
