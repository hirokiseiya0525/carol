import axios, { AxiosInstance } from "axios";
import * as path from "path";
import {
  OmakaseSet,
  PreferenceKeyword,
  PreferenceStrength,
  Sake,
  CreditCardInfo,
  PayApiResponse,
  OmakaseSetsResponse,
  OrderSetResponse,
  GetItemsResponse,
  PurchaseResponse
} from "./types";

const STATIC_CONTENT_ENDPOINT = "http://18.218.151.99:8080/sakeapp/public";

export class ApiClient {
  private static ENDPOINT = "http://18.218.151.99:8080/sakeapp/public/api";
  // private static ENDPOINT =
  //   "http://ec2-18-222-108-7.us-east-2.compute.amazonaws.com:8080/sakeapp/public/api";
  private _instance: AxiosInstance;

  constructor() {
    this._instance = axios.create({
      baseURL: ApiClient.ENDPOINT,
      timeout: 5000
    });
  }

  /**
   * /api/items
   * @param postcode ハイフンなし郵便番号 (例: 5630002)
   * @param keyword キーワード
   * @param strength 酒の強さ
   */
  async getItems(
    postcode: string,
    keyword: string[],
    strength: string[]
  ): Promise<GetItemsResponse> {
    const params = {
      postcode,
      keyword: keyword.join(","),
      strength: strength ? strength.join(",") : ""
    };

    const result = await this.createGetRequest<GetItemsResponse>(
      "/items",
      params
    );

    const actual: GetItemsResponse = {
      items: result.items.map(x => ({
        ...x,
        image_url: resolveImageUrl(x.image_url)
      }))
    };

    return actual;
  }

  /**
   * おまかせセットのデータを取得する
   * /api/omakase
   * @param postCode ハイフン無し郵便番号 (例: 5630002)
   */
  async getOmakaseSets(postCode: string): Promise<OmakaseSetsResponse> {
    const params = { postcode: postCode };
    const result = await this.createGetRequest<OmakaseSetsResponse>(
      `/omakase`,
      params
    );

    const actual = {
      sets: result.sets.map(x => ({
        ...x,
        thumbnail: resolveImageUrl(x.thumbnail)
      }))
    };

    return actual;
  }

  /**
   * セットを注文する
   * /api/set_order
   */
  async orderSet(set_id: number): Promise<OrderSetResponse> {
    const params = { set_id };
    const result = await this.createGetRequest<OrderSetResponse>(
      "/set_order",
      params
    );

    const actual: OrderSetResponse = {
      ...result,
      items: result.items.map(x => ({
        ...x,
        thumbnail: resolveImageUrl(x.thumbnail)
      }))
    };

    return actual;
  }

  /**
   * 注文を確定する前に、お届け目安時間などを取得するためのAPI
   * GET '/api/purchase'
   */
  async purchase(item_id: number[]): Promise<PurchaseResponse> {
    const params = { item_id: item_id.join(",") };
    const result = await this.createGetRequest<PurchaseResponse>(
      "/purchase",
      params
    );

    const actual: PurchaseResponse = {
      ...result,
      items: result.items.map(x => ({
        ...x,
        image_url: resolveImageUrl(x.image_url)
      }))
    };

    return actual;
  }

  /**
   * 購入確定時に、注文者の情報を送る
   * POST /api/purchase
   * @param address お届け先住所
   * @param name お届け先の人の名前
   * @param email 注文者のメールアドレス
   */
  async agreePurchase(address: string, name: string, email: string) {
    const data = { purchase_id: 9999, address, name, email }; // FIXME: 適当でいい?

    return this.createPostRequest("/purchase", data);
  }

  /**
   * クレジットカードで支払う
   * POST /api/pay/credit
   */
  async payByCreditCard(
    creditCardInfo: CreditCardInfo
  ): Promise<PayApiResponse> {
    const { number, security_code, name, expiration } = creditCardInfo;

    const params = {
      purchase_id: 9999,
      number,
      security_code,
      name,
      expiration
    }; // FIXME: てきとうでいい？

    return await this.createPostRequest<PayApiResponse>("/pay/credit", params);
  }

  private async createGetRequest<T>(
    relativePath: string,
    params?: { [key: string]: string | number }
  ): Promise<T> {
    const r = await this._instance.get<T>(this.resolveUrl(relativePath), {
      params
    });
    return r.data;
  }

  private async createPostRequest<T>(
    relativePath: string,
    data?: any
  ): Promise<T> {
    const r = await this._instance.post<T>(this.resolveUrl(relativePath), data);
    return r.data;
  }

  private resolveUrl(relativePath: string): string {
    return path.resolve(ApiClient.ENDPOINT, relativePath);
  }
}

export function resolveImageUrl(relativePath: string): string {
  return STATIC_CONTENT_ENDPOINT + "/" + relativePath;
}
