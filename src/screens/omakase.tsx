import * as React from "react";
import { AppHeader } from "../components/organisms/appHeader";
import { UIHeader } from "../components/atoms/typography";
import { OmakaseItem } from "../components/organisms/omakaseItem";
import { LoadingCircle } from "../components/atoms/loadingCircle";
import AppFooter from "../components/organisms/appFooter";
import { OmakaseSet } from "../api/types";
import { ApiClient } from "../api/apiClient";
import styled from "styled-components";
import { dummySakeData, dummyOmakaseSetData } from "../data/sake";
import { RootContainer } from "../components/atoms/rootContainer";
import { ModalContainer } from "../components/atoms/modalContainer";
import { SakeDetailModal } from "../components/templates/sakeDetailModal";
import { OmakaseSetDetailModal } from "../components/templates/omakaseSetDetailModal";
import { RouterProps } from "react-router";
import OrderConfirmationScreen from "./orderConfirmationScreen";
import { NavigateToOrderConfirmationContext } from "../util/router";

interface Props {}

type P = Props & RouterProps;

interface State {
  items: OmakaseSet[];
  loaded: boolean;
  isModalVisible: boolean;
  focusedItem?: OmakaseSet;
}

export default class OmakaseScreen extends React.Component<P, State> {
  constructor(props: P, state: State) {
    super(props, state);
    this.state = {
      items: [],
      loaded: false,
      isModalVisible: false
    };
  }

  async componentDidMount() {
    const client = new ApiClient();
    const data = await client.getOmakaseSets("2345678");

    console.log("data from server:");
    console.log(data);

    this.setState({
      items: data.sets,
      loaded: true
    });
  }

  openModal() {
    this.setState({
      isModalVisible: true
    });
  }

  closeModal() {
    this.setState({
      isModalVisible: false
    });
  }

  onOmakaseItemClicked(omakase: OmakaseSet) {
    this.setState({
      focusedItem: omakase
    });
    this.openModal();
  }

  onOrderButtonClicked() {
    const omakase = this.state.focusedItem!!;

    const context: NavigateToOrderConfirmationContext = {
      autoFilled: false,
      set_id: omakase.id
    };

    this.props.history.push("/order/confirm", context);
  }

  render() {
    const { items, loaded, isModalVisible, focusedItem } = this.state;

    console.log(items);

    return (
      <div>
        <AppHeader />
        <RootContainer>
          <UIHeader style={{ marginTop: 20, marginBottom: 6 }}>
            おまかせ
          </UIHeader>
          <div />
          {loaded ? (
            <div>
              {items.map((omakase: OmakaseSet, index: number) => (
                <OmakaseItem
                  key={index}
                  {...omakase}
                  style={{
                    marginBottom: 24
                  }}
                  onClick={() => this.onOmakaseItemClicked(omakase)}
                />
              ))}
            </div>
          ) : (
            <LoadingCircle />
          )}
        </RootContainer>

        <ModalContainer
          visible={isModalVisible}
          onClose={this.closeModal.bind(this)}
        >
          <OmakaseSetDetailModal
            {...focusedItem!!}
            orderButtonClicked={this.onOrderButtonClicked.bind(this)}
          />
        </ModalContainer>
      </div>
    );
  }
}
