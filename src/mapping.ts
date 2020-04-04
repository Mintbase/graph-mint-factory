import { BigInt, BigDecimal } from "@graphprotocol/graph-ts";
import { StoreLaunch } from "../generated/Contract/Contract";
import { Mintbase, Store, User } from "../generated/schema";
import { StoreContract } from "../generated/templates";
import { Thing as Contract } from "../generated/Contract/Thing";
export function handleStoreLaunch(event: StoreLaunch): void {
  let factory = Mintbase.load("1");
  if (factory == null) {
    factory = new Mintbase("1");
    factory.storeCount = BigInt.fromI32(0);
    factory.stores = [];
    factory.tokenCount = BigInt.fromI32(0);
    factory.transferCount = BigInt.fromI32(0);
    factory.boughtCount = BigInt.fromI32(0);
    factory.valueCount = BigDecimal.fromString("0");
  }

  let store = Store.load(event.params.store.toHex());
  if (store == null) {
    store = new Store(event.params.store.toHex());
  }

  // store.owner = event.transaction.from

  let contract = Contract.bind(event.params.store);

  store.owner = contract.maker();
  store.name = event.params.name.toString();
  store.symbol = event.params.symbol.toString();
  store.totalSupply = BigInt.fromI32(0);
  store.resolveUser = contract.maker().toHex();
  store.timestamp = event.block.timestamp.toString();
  store.resolveApprovers = [];

  factory.storeCount = factory.storeCount + BigInt.fromI32(1);
  factory.stores.push(event.params.store.toHex());
  store.burned = false;

  let user = User.load(contract.maker().toHex());
  if (!user) {
    user = new User(contract.maker().toHex());
  }

  user.save();

  StoreContract.create(event.params.store);

  factory.save();
  store.save();
}
