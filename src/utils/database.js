import Dexie from 'dexie';

export default class Database {
  constructor(name) {
    this.db = new Dexie(name);
    this.db.version(1).stores({
      newsCards: 'id++,date,link,name,stock',
      stocks: 'id++,name,ticker,count,price',
    });
  }

  async putStock(stock) {
    await this.db.stocks.put(stock);
  }

  async getStocks() {
    const stocks = await this.db.stocks.toArray();
    return stocks;
  }

  async addStock(stock) {
    await this.db.stocks.add(stock);
  }

  async removeStock(stock) {
    await this.db.stocks.delete(stock.id);
  }

  async putNewsCard(card) {
    await this.db.newsCards.put(card);
  }

  async getNewsCards() {
    const newsCard = await this.db.newsCards.toArray();
    return newsCard;
  }

  async addNewsCard(card) {
    await this.db.newsCards.add(card);
  }

  async removeNewsCard(newsCard) {
    await this.db.newsCards.delete(newsCard.id);
  }
}
