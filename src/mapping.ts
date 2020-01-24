import { BigInt } from "@graphprotocol/graph-ts"
import { Contract, StoreLaunch } from "../generated/Contract/Contract"
import { Mintbase, Store, User } from "../generated/schema"
import { StoreContract } from "../generated/templates"

export function handleStoreLaunch(event: StoreLaunch): void {

  let factory = Mintbase.load('1')
  if (factory == null) {
    factory = new Mintbase('1')
    factory.count = BigInt.fromI32(0)
    factory.stores = []
  }

  let store = Store.load(event.params.store.toHex())
  if (store == null) {
    store = new Store(event.params.store.toHex())
  }

  store.owner = event.transaction.from
  store.timestamp = event.block.timestamp.toString();
  store.name = event.params.name.toString()
  store.symbol = event.params.symbol.toString()
  store.totalSupply = BigInt.fromI32(0)
  store.resolveUser = event.transaction.from.toHex();

  factory.count = factory.count + BigInt.fromI32(1)
  factory.stores.push(event.params.store.toHex())
  store.burned = false;


  let user = User.load(event.transaction.from.toHex())
  if (!user) {
    user = new User(event.transaction.from.toHex())
  }

  user.save()


  StoreContract.create(event.params.store)

  factory.save()
  store.save()

}
