[x] remove the id from activeEntries... no point
[ ] Use $addToSet equivalent to push to array. learn about this well on mongo.
This seems to be working pretty well!!!

db.collection.update({
"owner.endpoint": "scislowski-usd266",
"activeQueues.\_id": ObjectId("655ea96eb694908fcfa3260b"),
"activeQueues.entries": {
$not: {
      $elemMatch: {
        "user.email": "a@gmail.com"
      }
    }
  }
},
{
  $push: {
    "activeQueues.$.entries": {
"timestamp": "a",
"user": {
"email": "a@gmail.com",
"familyName": "a",
"givenName": "b"
}
}
}
})
