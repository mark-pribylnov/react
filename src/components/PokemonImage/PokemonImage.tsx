import Image from 'next/image';

type PokemonImageProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
};

export default function PokemonImage({
  src,
  alt,
  width,
  height,
  className,
}: PokemonImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
    />
  );
}
