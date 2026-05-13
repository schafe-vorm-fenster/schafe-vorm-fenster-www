"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Button from "../button";

type CarouselItem = {
  id: number;
  title: string;
  imageUrl: string;
  path: string;
};

const carouselItems: CarouselItem[] = [
  {
    id: 1,
    title: "Schlatkow",
    imageUrl: "schlatkow.jpg",
    path: "schlatkow",
  },
  {
    id: 2,
    title: "Bröllin",
    imageUrl: "broellin.jpg",
    path: "broellin",
  },
  {
    id: 3,
    title: "Stolpe an der Peene",
    imageUrl: "stolpe-an-der-peene.jpg",
    path: "stolpe-an-der-peene",
  },
  {
    id: 4,
    title: "Krenzow",
    imageUrl: "krenzow.jpg",
    path: "krenzow",
  },
  {
    id: 5,
    title: "Zarrentin",
    imageUrl: "zarrentin.jpg",
    path: "zarrentin",
  },
  {
    id: 6,
    title: "Steinfurth",
    imageUrl: "steinfurth.jpg",
    path: "steinfurth",
  },
  {
    id: 7,
    title: "Quilow",
    imageUrl: "quilow.jpg",
    path: "quilow",
  },
  {
    id: 8,
    title: "Karlshagen",
    imageUrl: "karlshagen.jpg",
    path: "karlshagen",
  },
  {
    id: 9,
    title: "Groß Bünzow",
    imageUrl: "gross-buenzow.jpg",
    path: "gross-buenzow",
  },
];

export default function CommunitiesCarousel() {
  const options = { loop: true, autoplay: true, delay: 2000 };
  const [emblaRef, emblaApi] = useEmblaCarousel(options, [Autoplay()]);

  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {carouselItems.map((item) => (
            <div key={item.id} className="relative flex-[0_0_100%] min-w-0">
              <div className="relative h-[60vh] w-full">
                <Image
                  src={"/img/communities/" + item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="100vw"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col items-center justify-center  p-4">
                  <h2 className="text-6xl font-medium text-center mb-6 text-white">
                    {item.title}
                  </h2>
                  <Button
                    link={"https://schafe-vorm-fenster.de/" + item.path}
                    label="zum Dorfterminkalender"
                    color="white"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
        {carouselItems.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full ${
              index === selectedIndex ? "bg-white" : "bg-white/50"
            }`}
            onClick={() => scrollTo(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
