(function() {
  var A1Client, AmazonClient, CanadaPostClient, DhlClient, DhlGmClient, FedexClient, LasershipClient, OnTracClient, PrestigeClient, UpsClient, UpsMiClient, UspsClient, guessCarrier;

  UpsClient = require('./ups').UpsClient;

  FedexClient = require('./fedex').FedexClient;

  UspsClient = require('./usps').UspsClient;

  LasershipClient = require('./lasership').LasershipClient;

  DhlClient = require('./dhl').DhlClient;

  OnTracClient = require('./ontrac').OnTracClient;

  UpsMiClient = require('./upsmi').UpsMiClient;

  AmazonClient = require('./amazon').AmazonClient;

  A1Client = require('./a1').A1Client;

  CanadaPostClient = require('./canada_post').CanadaPostClient;

  DhlGmClient = require('./dhlgm').DhlGmClient;

  PrestigeClient = require('./prestige').PrestigeClient;

  guessCarrier = require('./guessCarrier');

  module.exports = {
    UpsClient: UpsClient,
    FedexClient: FedexClient,
    UspsClient: UspsClient,
    LasershipClient: LasershipClient,
    DhlClient: DhlClient,
    OnTracClient: OnTracClient,
    UpsMiClient: UpsMiClient,
    AmazonClient: AmazonClient,
    A1Client: A1Client,
    CanadaPostClient: CanadaPostClient,
    DhlGmClient: DhlGmClient,
    PrestigeClient: PrestigeClient,
    guessCarrier: guessCarrier
  };

}).call(this);
