import * as React from "react";
import { AppHeader } from "../components/organisms/appHeader";
import { UIHeader, CaptionText } from "../components/atoms/typography";
import { Sake, PreferenceKeyword, PreferenceStrength } from "../api/types";
import { SakeItem } from "../components/organisms/sakeItem";
import { SakeDetailModal } from "../components/templates/sakeDetailModal";
import SelectedItemsBar from "../components/organisms/selectedItemsBar";
import { dummySakeData } from "../data/sake";
import { RouterProps, RouteProps } from "react-router";
import { RootContainer } from "../components/atoms/rootContainer";
import { buffy } from "../util/array";
import styled from "styled-components";
import { LoadingCircle } from "../components/atoms/loadingCircle";
import { ApiClient } from "../api/apiClient";
import { BottomBarLocator } from "../components/atoms/bottomBarLocator";
import { ModalContainer } from "../components/atoms/modalContainer";
import {
  NavigateToOrderConfirmationContext,
  NavigateToRecommendedItemsContext
} from "../util/router";
const Rodal = require("rodal").default;

interface P {
  userName?: string;
}

type Props = P & RouterProps & RouteProps;

interface State {
  isModalVisible: boolean;
  focusedItem?: Sake;
  selectedItems: Sake[];
  items: Sake[];
  isLoaded: boolean;
}

const ItemsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
`;

export default class RecommendedScreen extends React.Component<Props, State> {
  constructor(props: Props, state: State) {
    super(props, state);

    this.state = {
      isModalVisible: false,
      focusedItem: undefined,
      selectedItems: [],
      items: [],
      isLoaded: false
    };
  }

  async componentDidMount() {
    // const api = new ApiClient();

    // const result = await api.getItems(
    //   "2998787",
    //   [PreferenceKeyword.オレンジ],
    //   [PreferenceStrength.low, PreferenceStrength.mid, PreferenceStrength.high]
    // );
    // this.setState({
    //   isLoaded: true,
    //   items: result.items
    // });

    const api = new ApiClient();
    // 選択したキーワードをパラメータでとってくる必要がある。

    if (!this.props.location) throw "おかしい";

    const context = this.props.location
      .state as NavigateToRecommendedItemsContext;

    const { selectedAlcoholStrength, selectedKeywords } = context;

    const result = await api.getItems(
      "2771234",
      selectedKeywords,
      selectedAlcoholStrength
    );

    console.log(result);

    this.setState({
      isLoaded: true,
      items: result.items
    });
  }

  onSakeItemClicked(sake: Sake) {
    this.setState({
      focusedItem: sake
    });
    this.openModal();
  }

  openModal() {
    this.setState({ isModalVisible: true });
  }

  closeModal() {
    this.setState({ isModalVisible: false });
  }

  onSelectButtonClicked(sake: Sake) {
    const { selectedItems } = this.state;
    if (selectedItems.length >= 4) {
      alert("すでに4点選択しています。");
      return;
    }

    const items = selectedItems.slice();
    const index = items.findIndex(x => x.id === sake.id);

    if (index >= 0) {
      // 削除しています
      items.splice(index, 1);
    } else {
      items.push(sake);
    }

    this.setState({
      selectedItems: items
    });

    setTimeout(() => {
      // モーダルを閉じる
      this.closeModal();
    }, 300);
  }

  onNextButtonClick() {
    const { selectedItems } = this.state;

    const state: NavigateToOrderConfirmationContext = {
      autoFilled: selectedItems.length < 5,
      item_id: selectedItems.map(x => x.id)
    };

    this.props.history.push({
      pathname: "/order/confirm",
      state
    });
  }

  renderItems() {
    const { selectedItems } = this.state;

    return buffy(this.state.items, 2).map((row: Sake[], index1: number) => (
      <ItemsWrapper key={index1}>
        {row.map((sake: Sake, index2: number) => (
          <SakeItem
            key={index1 * 2 + index2}
            {...sake}
            displayName={sake.name}
            isSelected={selectedItems.findIndex(x => x.id === sake.id) >= 0}
            onClick={() => this.onSakeItemClicked(sake)}
          />
        ))}
      </ItemsWrapper>
    ));
  }

  renderNoItems() {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "24px 0"
        }}
      >
        <CaptionText>おさけが見つかりませんでした。</CaptionText>
      </div>
    );
  }

  render() {
    const { userName } = this.props;
    const {
      isModalVisible,
      focusedItem,
      selectedItems,
      items,
      isLoaded
    } = this.state;

    const sake = focusedItem!!;
    const isCurrentFocusedItemSelected =
      selectedItems.findIndex(x => x.id === sake.id) >= 0;

    const anyItemSelected = selectedItems.length > 0;

    return (
      <div>
        <AppHeader />
        <RootContainer>
          <UIHeader>
            {userName ? userName + "さんへのおすすめ" : "あなたへのおすすめ"}
          </UIHeader>

          <div
            style={{
              marginBottom: anyItemSelected ? 180 : 0
            }}
          >
            {isLoaded ? (
              this.state.items.length > 0 ? (
                this.renderItems()
              ) : (
                this.renderNoItems()
              )
            ) : (
              <LoadingCircle />
            )}
          </div>
        </RootContainer>
        <ModalContainer
          visible={isModalVisible}
          onClose={this.closeModal.bind(this)}
        >
          <SakeDetailModal
            {...sake}
            isSelected={isCurrentFocusedItemSelected}
            onSelectButtonClicked={() => this.onSelectButtonClicked(sake)}
          />
        </ModalContainer>
        {anyItemSelected ? (
          <BottomBarLocator>
            <SelectedItemsBar
              style={{ position: "fixed", bottom: 0, display: "block" }}
              items={selectedItems}
              onNextButtonClicked={this.onNextButtonClick.bind(this)}
            />
          </BottomBarLocator>
        ) : null}
      </div>
    );
  }
}
