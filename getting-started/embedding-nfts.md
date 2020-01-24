---
description: >-
  Having your NFTs appear in any Squarespace, HubSpot, or your own custom site
  allows users to view and buy the NFTs without ever leaving your site.
---

# Embedding NFTs

{% embed url="https://www.youtube.com/watch?v=yizFw9aWR9o" %}

```text
<link
  href="https://fonts.googleapis.com/css?family=Lato:300,400,700&display=swap"
  rel="stylesheet"
/> 
<div id="mintbase-app"></div>
<button id="mintbase-open" onclick="initMintbase()">NFT TICKET</button>
<script src="https://firebasestorage.googleapis.com/v0/b/thing-1d2be.appspot.com/o/packages%2Fruntime.js?alt=media&token=83829758-30e4-451d-9804-83fa95f1cbdc"></script>
<script src="https://firebasestorage.googleapis.com/v0/b/thing-1d2be.appspot.com/o/packages%2Fmain.js?alt=media&token=eea92974-87be-4311-a977-e9d9f9f22dff"></script>
<script src="https://firebasestorage.googleapis.com/v0/b/thing-1d2be.appspot.com/o/packages%2Fbig.js?alt=media&token=3b30aab0-48f3-4109-88a7-43249821a140"></script>
<style>
  #mintbase-open {
    background-color: Transparent;
    border: 1px solid #eeeeee;
    padding: 15px;
    color: #eeeeee;
    font-size: 1.2rem;
    font-weight: bold;
  }
  #mintbase-open:hover {
    cursor: pointer;
  }
</style>

<script>
  function initMintbase() {
    window.renderGroups.runApp({
        contract: '0x0ddeb143c622588709aa20a58c776b3ba7f1568e',
        finishedUrl: '',
        buttonText: 'NFT.Kred',
        twitterHandle: '@NFT_NYC',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        hideAvailable: false,
      initialized: function() {
        // Do something when the app has loaded
      }
    });
  }
</script>

```

### Your Custom Data

Make sure to add your own smart contract minted on Mintbase. Your can find this in the URL

```text
function initMintbase() {
  window.renderGroups.runApp({
      contract: '0x0ddeb143c622588709aa20a58c776b3ba7f1568e',
      finishedUrl: '',
      buttonText: 'NFT.Kred',
      twitterHandle: '@NFT_NYC',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      hideAvailable: false,
    initialized: function() {
      // Do something when the app has loaded
    }
  });
}
```

|  Keys | Type | Example | Description |
| :--- | :--- | :--- | :--- |
| contract | string | 0x8d7dd7B604b4e0A8Dd3Cc343522cAA2Aa426e6E7 | Ethereum contract address hash  |
| finishedUrl | url  | https://mintbase.io/my-things | If you want the user to check out their new token on your own website, this will appear after the user purchased your token. |
| twitterHandle | string | '@mintbase' | Gets added to our tweet when the user clicks the icon |

### Buttons to Open The NFT modal

Feel free to change the button CSS to match your website design

```text
#mintbase-open {
  background-color: Transparent;
  border: 1px solid #eeeeee;
  padding: 15px;
  color: #eeeeee;
  font-size: 1.2rem;
  font-weight: bold;
}
#mintbase-open:hover {
  cursor: pointer;
}
```

