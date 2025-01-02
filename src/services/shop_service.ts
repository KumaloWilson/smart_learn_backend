import { Shop, ShopModel } from '../models/shop';

const shopModel = new ShopModel();

export class ShopService {
    async createShop(shop: Shop): Promise<void> {
        await shopModel.create(shop);
    }

    async getAllShops(page: number = 1, perPage: number = 10): Promise<Shop[]> {
        return shopModel.findAll(page, perPage);
    }

    async getShopById(shopId: string): Promise<Shop | null> {
        return shopModel.findById(shopId);
    }

    async updateShop(shopId: string, shop: Partial<Shop>): Promise<void> {
        await shopModel.update(shopId, shop);
    }

    async deleteShop(shopId: string): Promise<void> {
        await shopModel.delete(shopId);
    }
}
