import { BigInt, Address, BigDecimal } from "@graphprotocol/graph-ts";
import {
  Thing as Contract,
  ErrorOut,
  BatchTransfered,
  Minted,
  BatchBurned,
  BatchForSale,
  Bought,
  OwnershipTransferred,
  MinterAdded,
  MinterRemoved,
  Transfer,
  Destroy,
  Approval,
  ApprovalForAll
} from "../generated/templates/StoreContract/Thing";
import { Mintbase, Store, Thing, Token, User } from "../generated/schema";
import { StoreContract } from "../generated/templates";

export function handleErrorOut(event: ErrorOut): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  // let entity = ExampleEntity.load(event.transaction.from.toHex())
  // // Entities only exist after they have been saved to the store;
  // // `null` checks allow to create entities on demand
  // if (entity == null) {
  //   entity = new ExampleEntity(event.transaction.from.toHex())
  //   // Entity fields can be set using simple assignments
  //   entity.count = BigInt.fromI32(0)
  // }
  // // BigInt and BigDecimal math are supported
  // entity.count = entity.count + BigInt.fromI32(1)
  // // Entity fields can be set based on event parameters
  // entity.error = event.params.error
  // entity.tokenId = event.params.tokenId
  // // Entities can be written to the store with `.save()`
  // entity.save()
  // Note: If a handler doesn't require existing field values, it is faster
  // _not_ to load the entity from the store. Instead, create it fresh with
  // `new Entity(...)`, set the fields that should be updated and save the
  // entity back to the store. Fields that were not set or unset remain
  // unchanged, allowing for partial updates to be applied.
  // It is also possible to access smart contracts from mappings. For
  // example, the contract that has emitted the event can be connected to
  // with:
  //
  // let contract = Contract.bind(event.address)
  //
  // The following functions can then be called on this contract to access
  // state variables and other data:
  //
  // - contract.supportsInterface(...)
  // - contract.name(...)
  // - contract.getApproved(...)
  // - contract.totalSupply(...)
  // - contract.tokenOfOwnerByIndex(...)
  // - contract.tokenByIndex(...)
  // - contract.maker(...)
  // - contract.mintWithTokenURI(...)
  // - contract.ownerOf(...)
  // - contract.balanceOf(...)
  // - contract.owner(...)
  // - contract.isOwner(...)
  // - contract.symbol(...)
  // - contract.baseUri(...)
  // - contract.isMinter(...)
  // - contract.id(...)
  // - contract.items(...)
  // - contract.isApprovedForAll(...)
  // - contract.tokenURI(...)
  // - contract.tokensOfOwner(...)
}

export function handleBatchTransfered(event: BatchTransfered): void {}

export function handleDestroy(event: Destroy): void {
  let address = event.address.toHex();

  let store = Store.load(address);
  if (store == null) {
    store = new Store(address);
  }

  store.burned = true;

  store.save();
}

export function handleMinted(event: Minted): void {
  let thing = Thing.load(event.params.metaId);
  if (thing == null) {
    thing = new Thing(event.params.metaId);
  }

  let mintbase = Mintbase.load("1");
  if (mintbase == null) {
    mintbase = new Mintbase("1");
  }
  mintbase.tokenCount = mintbase.tokenCount.plus(BigInt.fromI32(1));
  mintbase.save();

  let contract = Contract.bind(event.address);
  let address = event.address.toHex();

  let store = Store.load(address);
  if (store == null) {
    store = new Store(address);
  }

  store.totalSupply = contract.totalSupply();

  thing.minter = contract.maker();
  thing.metaId = event.params.metaId;
  thing.burned = false;
  thing.forSale = true;
  thing.timestamp = event.block.timestamp.toString();

  let tokenId = event.params.id.toString();

  let item = contract.items(event.params.id);

  let uniqueId = address.concat("-").concat(tokenId);
  let token = Token.load(uniqueId);
  if (token == null) {
    token = new Token(uniqueId);
  }

  token.state = item.value3.toString();
  token.price = item.value1.toString();
  token.metaId = item.value2.toString();
  token.tokenId = tokenId;
  token.resolvedThing = event.params.metaId;
  token.store = event.address.toHex();
  token.resolveOwner = contract.maker().toHex();
  token.burned = false;

  token.save();

  thing.resolveStore = address;

  store.save();
  thing.save();
}

export function handleBatchBurned(event: BatchBurned): void {
  let thing = Thing.load(event.params.metaId);

  let address = event.address.toHex();

  let store = Store.load(address);
  if (store == null) {
    store = new Store(address);
  }
  let contract = Contract.bind(event.address);
  store.totalSupply = contract.totalSupply();

  if (thing == null) {
    return;
  }

  let ids = event.params.ids;

  for (var i = 0; i < ids.length; i++) {
    let items = contract.items(ids[i]);
    let address = event.address.toHex();
    let uniqueId = address.concat("-").concat(ids[i].toString());

    let token = Token.load(uniqueId);
    if (token == null) {
      token = new Token(uniqueId);
    }
    token.burned = true;
    token.save();
  }

  thing.burned = true;
  thing.save();
  store.save();
}

export function handleBatchForSale(event: BatchForSale): void {
  let thing = Thing.load(event.params.metaId);
  if (thing == null) {
    return;
  }

  let ids = event.params.ids;
  let contract = Contract.bind(event.address);

  for (var i = 0; i < ids.length; i++) {
    let items = contract.items(ids[i]);
    let address = event.address.toHex();
    let uniqueId = address.concat("-").concat(ids[i].toString());

    let token = Token.load(uniqueId);
    if (token == null) {
      token = new Token(uniqueId);
    }
    token.state = "1";
    token.save();
  }
  thing.forSale = true;
  thing.save();
}

export function handleBought(event: Bought): void {
  let tokenId = event.params.tokenId.toString();

  let mintbase = Mintbase.load("1");
  if (mintbase == null) {
    mintbase = new Mintbase("1");
  }
  mintbase.boughtCount = mintbase.boughtCount.plus(BigInt.fromI32(1));

  let value = BigDecimal.fromString(event.params.value.toString());
  let eth = BigDecimal.fromString("1000000000000000000");
  let amount = value.div(eth);

  mintbase.valueCount = mintbase.valueCount.plus(amount);

  mintbase.save();

  let address = event.address.toHex();
  let uniqueId = address.concat("-").concat(tokenId);
  let token = Token.load(uniqueId);
  if (token == null) {
    token = new Token(uniqueId);
  }
  token.state = "2";
  token.save();
}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {}

export function handleMinterAdded(event: MinterAdded): void {}

export function handleMinterRemoved(event: MinterRemoved): void {}

export function handleTransfer(event: Transfer): void {
  let mintbase = Mintbase.load("1");
  if (mintbase == null) {
    mintbase = new Mintbase("1");
  }
  mintbase.transferCount = mintbase.transferCount.plus(BigInt.fromI32(1));
  mintbase.save();

  let address = event.address.toHex();
  let uniqueId = address.concat("-").concat(event.params.tokenId.toString());

  let token = Token.load(uniqueId);
  if (token == null) {
    return;
  }

  let user = User.load(event.params.to.toHex());
  if (!user) {
    user = new User(event.params.to.toHex());
  }
  user.save();

  token.state = "3";

  token.resolveOwner = event.params.to.toHex();

  token.save();
}

export function handleApproval(event: Approval): void {}

export function handleApprovalForAll(event: ApprovalForAll): void {
  let user = User.load(event.params.operator.toHex());
  if (!user) {
    user = new User(event.params.operator.toHex());
  }

  let address = event.address.toHex();

  let store = Store.load(address);
  if (store == null) {
    store = new Store(address);
  }

  store.resolveApprovers.push(event.params.operator.toHex());
  store.save();
  user.save();
}
