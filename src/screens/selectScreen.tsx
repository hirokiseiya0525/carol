import * as React from "react";
import {
  ScrollImageItem,
  ScrollImageItemProps
} from "../components/atoms/scrollImageItem";
import {
  CheckButton,
  CheckButtonProps
} from "../components/atoms/scrollTextItem";
import { UISubheader, UIHeader } from "../components/atoms/typography";
import styled from "styled-components";
import SelectBottomBar from "../components/organisms/selectBottombar";
import { AppHeader } from "../components/organisms/appHeader";
import { RouterProps } from "react-router";
import { RootContainer } from "../components/atoms/rootContainer";
import { dummyKeywordList, alcoholStrengthList } from "../data/keywords";

type Props = RouterProps;

interface State {
  strengthList: CheckButtonProps[];
  keywordList: ScrollImageItemProps[];
}

const ItemsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const AlcoholStrengthButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

export default class SelectScreen extends React.Component<Props, State> {
  constructor(props: Props, state: State) {
    super(props, state);

    this.state = {
      strengthList: alcoholStrengthList,
      keywordList: dummyKeywordList
    };
  }

  onAlcoholStrengthClick(name: string) {
    const list = this.state.strengthList.slice();
    const item = list.find(x => x.id === name)!!;
    item.isChecked = !item.isChecked;
    this.setState({
      strengthList: list
    });
  }

  onKeywordClick(name: string) {
    const list = this.state.keywordList.slice();
    const item = list.find(x => x.id === name)!!;
    item.isChecked = !item.isChecked;
    this.setState({
      keywordList: list
    });
  }

  getSelectedItems() {
    const { keywordList, strengthList } = this.state;
    const list = [...keywordList, ...strengthList];
    return list.filter(x => x.isChecked).map(x => x.id);
  }

  onNextButtonClicked() {
    this.props.history.push("/items");
  }

  render() {
    const { strengthList, keywordList } = this.state;

    const sectionStyle: React.CSSProperties = {
      margin: "32px 0"
    };

    return (
      <div>
        <AppHeader />
        <RootContainer>
          <div style={sectionStyle}>
            <UIHeader style={{}}>えらぶ</UIHeader>
            <UISubheader>キーワード</UISubheader>
            <ItemsWrapper>
              {keywordList.map((d: ScrollImageItemProps, index: number) => (
                <ScrollImageItem
                  key={index}
                  style={{
                    marginRight: 8,
                    marginBottom: 10
                  }}
                  onClick={() => this.onKeywordClick(d.id)}
                  {...d}
                />
              ))}
            </ItemsWrapper>
          </div>
          <div style={sectionStyle}>
            <UISubheader>アルコールの強さ</UISubheader>
            <AlcoholStrengthButtonWrapper>
              {strengthList.map((d: CheckButtonProps, index: number) => (
                <CheckButton
                  key={index}
                  onClick={() => this.onAlcoholStrengthClick(d.id)}
                  {...d}
                />
              ))}
            </AlcoholStrengthButtonWrapper>
          </div>
        </RootContainer>

        <SelectBottomBar
          selectedItems={this.getSelectedItems()}
          onNextButtonClicked={this.onNextButtonClicked.bind(this)}
          isNextButtonEnabled={false}
        />
      </div>
    );
  }
}
