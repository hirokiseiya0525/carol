import * as React from "react";
import ImagePlaceholder from "../atoms/imagePlaceholder";

interface Props {
  number: number;
  image: string;
  name: string;
  price: number;
}

export const SakeTableCell: React.StatelessComponent<Props> = props => {
  const { number, image, name, price } = props;

  return (
    <tr>
      <td>{number}</td>
      <td>
        <ImagePlaceholder width={50} height={50} />
      </td>
      <td>{name}</td>
      <td>{price}円</td>
    </tr>
  );
};