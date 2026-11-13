import Image from "next/image";
import Button from "../button";

export default function Intro() {
  return (
    <div className="relative flex flex-col-reverse md:flex-row">
      <div id="claim" className="relative mx-auto pt-12 md:pt-24">
        <div className="mr-6 md:ml-auto">
          <h1 className="font-semibold text-5xl">
            Deine digitale Terminliste.
          </h1>
          <p className="mt-6">
            Erfahre was wann wo in deinem Ort los ist. Einfach per Smartphone.
          </p>
          <div className="mt-8">
            <Button
              link="https://schafe-vorm-fenster.de/"
              label="Finde dein Dorf"
              color="white"
            />
          </div>
        </div>
      </div>
      <div
        id="visual"
        className="relative h-80 overflow-hidden md:h-full md:w-1/3 lg:w-1/2"
      >
        <Image
          src="/dorfterminkalender-smartphone.png"
          alt="Dorfterminkalender auf Smartphone"
          className=" inset-0 w-full h-full object-contain"
          layout="cover"
          width={500}
          height={500}
        />
      </div>
    </div>
  );
}
