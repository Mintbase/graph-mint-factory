
import { BigInt, BigDecimal } from "@graphprotocol/graph-ts"
import { Contract, StoreLaunch } from "../generated/Contract/Contract"
import { Mintbase, Store, User } from "../generated/schema"
import { StoreContract } from "../generated/templates"

export function handleStoreLaunch(event: StoreLaunch): void {

  let factory = Mintbase.load('1')
  if (factory == null) {
    factory = new Mintbase('1')
    factory.storeCount = BigInt.fromI32(0)
    factory.stores = []
    factory.tokenCount = BigInt.fromI32(0)
    factory.transferCount = BigInt.fromI32(0)
    factory.boughtCount = BigInt.fromI32(0)
    factory.valueCount = BigDecimal.fromString('0')
  }

  let store = Store.load(event.params.store.toHex())
  if (store == null) {
    store = new Store(event.params.store.toHex())
  }

  store.owner = event.transaction.from
  store.name = event.params.name.toString()
  store.symbol = event.params.symbol.toString()
  store.totalSupply = BigInt.fromI32(0)
  store.resolveUser = event.transaction.from.toHex();
  store.timestamp = event.block.timestamp.toString();


  factory.storeCount = factory.storeCount + BigInt.fromI32(1)
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