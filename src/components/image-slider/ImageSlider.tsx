import { useState, useEffect, useCallback } from "react";
import { BsArrowLeftCircleFill, BsArrowRightCircleFill } from "react-icons/bs";
import { cn } from "@/lib/utils";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

interface ImageParams {
  url: string;
  limit?: number;
  page?: number;
}
const ImageSlider = ({ url, limit = 5, page = 1 }: ImageParams) => {
  interface ImageItem {
    id: string;
    author: string;
    width: number;
    height: number;
    url: string;
    download_url: string;
  }

  const [images, setImages] = useState<ImageItem[]>([]);
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchImages = useCallback(
    async (getUrl: string) => {
      try {
        setLoading(true);
        const res = await fetch(`${getUrl}?page=${page}&limit=${limit}`);
        const data = await res.json();

        if (data) {
          setImages(data);
          setLoading(false);
        }
      } catch (error) {
        if (error instanceof Error) {
          setErrorMsg(error.message);
        } else {
          setErrorMsg("An unexpected error occurred");
        }

        setLoading(false);
      }
    },
    [page, limit],
  );

  useEffect(() => {
    if (url !== "") {
      fetchImages(url);
    }
  }, [fetchImages, url]);

  if (loading) {
    return (
      <div>
        <p>Loading Images...</p>
      </div>
    );
  }

  if (errorMsg !== null) {
    return <div className="error-container">Error: {errorMsg}</div>;
  }

  function handlePrev(): void {
    const prevImg = currentSlide === 0 ? images.length - 1 : currentSlide - 1;
    setCurrentSlide(prevImg);
  }

  function handleNext(): void {
    const nextImg = currentSlide === images.length - 1 ? 0 : currentSlide + 1;
    setCurrentSlide(nextImg);
  }

  return (
    <Card className="flex h-svh w-full flex-col items-center justify-center gap-6 px-8 py-4">
      <CardTitle className="-mb-4">Image Slider</CardTitle>
      <CardDescription>
        Browse through a collection of high-quality images using the navigation
        controls.
      </CardDescription>
      <div className="relative flex h-64 w-md items-center justify-center p-8 lg:w-lg">
        <BsArrowLeftCircleFill
          onClick={handlePrev}
          className="arrow-icon left-4"
        />
        {images && images.length
          ? images.map((image, index) => (
              <img
                className={cn(
                  "absolute inset-0 h-full w-full rounded-3xl object-cover shadow-md transition-opacity duration-300 ease-in-out",
                  currentSlide === index ? "z-1 opacity-100" : "z-0 opacity-0",
                )}
                key={image.id}
                src={image.download_url}
                alt="Laptop Image"
              />
            ))
          : null}
        <BsArrowRightCircleFill
          onClick={handleNext}
          className="arrow-icon right-4"
        />
        <span className="absolute bottom-4 mt-4 flex items-center justify-center gap-2">
          {images && images.length
            ? images.map((_, index) => (
                <button
                  key={index}
                  className={cn(
                    currentSlide === index
                      ? "scale-125 bg-black shadow-2xl shadow-white"
                      : "bg-gray-50 shadow-2xl shadow-black",
                    "z-10 h-3 w-3 cursor-pointer items-center justify-center rounded-full hover:scale-120",
                  )}
                  onClick={() => setCurrentSlide(index)}
                ></button>
              ))
            : null}
        </span>
      </div>
    </Card>
  );
};

export default ImageSlider;
