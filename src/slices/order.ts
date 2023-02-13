import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Order{
    orderId:string;
    start:{
        latitude:number;
        longitude:number;
    };
    end:{
        longitude:number;
        latitude:number;
    };
    price:number;
}

interface InitialState {
    orders:Order[],
    deliveries:Order[],
};
const initialState:InitialState={
    orders:[], // 배열은 ts가 타입 추론을 잘 못해서 interface 설정해줘야 함
    deliveries:[],
};

const order=createSlice({
    name:'order',
    initialState,
    reducers:{
        addOrder(state,action:PayloadAction<Order>){
            state.orders.push(action.payload)
        },
        acceptOrder(state, action: PayloadAction<string>) {
            const index = state.orders.findIndex(v => v.orderId === action.payload);
            if (index > -1) {
              state.deliveries.push(state.orders[index]);
              state.orders.splice(index, 1);
            }
          },
          rejectOrder(state, action: PayloadAction<string>) {
            const index = state.orders.findIndex(v => v.orderId === action.payload);
            if (index > -1) {
              state.orders.splice(index, 1);
            }
            const delivery = state.deliveries.findIndex(
              v => v.orderId === action.payload,
            );
            if (delivery > -1) {
              state.deliveries.splice(delivery, 1);
            }
          },
        },
        extraReducers: builder => {},
      });

      export default order;