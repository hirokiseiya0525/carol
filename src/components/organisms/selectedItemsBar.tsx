import * as React from "react";
import { Sake } from "../..//api/types";
import styled from "styled-components";
import { Color } from "../theme";
import { SelectedSakeItem } from "./selectedSakeItem";

interface Props {
  items: Sake[];
  style?: React.CSSProperties;
  onNextButtonClicked?: () => void;
}

const Wrapper = styled.div`
  width: 100%;
  height: 100px;
  padding: 8px;
`;

export default class SelectedItemsBar extends React.Component<Props> {
  render() {
    const { items, style, onNextButtonClicked } = this.props;

    const selectedItemsCount = items.length;
    const array = Array.from({ length: 5 }, (_, k) => k).slice(
      selectedItemsCount
    );

    const circleSize = 32;

    const commonItemStyle: React.CSSProperties = {
      margin: "4px"
    };

    return (
      <Wrapper style={style}>
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: Color.white,
            borderRadius: 16,
            boxShadow: "0 10px 10px 10px #eee"
          }}
        >
          <div
            style={{
              display: "flex"
            }}
          >
            {items.map((x: Sake, index: number) => (
              <SelectedSakeItem
                key={index}
                style={commonItemStyle}
                number={index + 1}
                size={circleSize}
                {...x}
              />
            ))}

            {// 残りを埋める
            array.map(index => (
              <SelectedSakeItem
                style={commonItemStyle}
                key={index}
                number={index + 1}
                size={circleSize}
              />
            ))}
          </div>
        </div>
      </Wrapper>
    );
  }
}
