export default interface ItemHistory {
  id: number;
  motorcycle_id: number;
  mileage: number;
  recorded_date: string;
  service_item_id: number | null;
}
