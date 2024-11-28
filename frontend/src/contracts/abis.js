export const priceOracleABI = [
    {"type":"constructor","inputs":[],"stateMutability":"nonpayable"},
    {"type":"function","name":"getAssetPrice","inputs":[{"name":"asset","type":"address","internalType":"address"}],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},
    {"type":"function","name":"owner","inputs":[],"outputs":[{"name":"","type":"address","internalType":"address"}],"stateMutability":"view"},
    {"type":"function","name":"priceFeeds","inputs":[{"name":"","type":"address","internalType":"address"}],"outputs":[{"name":"","type":"bytes32","internalType":"bytes32"}],"stateMutability":"view"},
    {"type":"function","name":"pyth","inputs":[],"outputs":[{"name":"","type":"address","internalType":"contract IPyth"}],"stateMutability":"view"},
    {"type":"function","name":"renounceOwnership","inputs":[],"outputs":[],"stateMutability":"nonpayable"},
    {"type":"function","name":"setPriceFeed","inputs":[{"name":"asset","type":"address","internalType":"address"},{"name":"priceId","type":"bytes32","internalType":"bytes32"}],"outputs":[],"stateMutability":"nonpayable"},
    {"type":"function","name":"transferOwnership","inputs":[{"name":"newOwner","type":"address","internalType":"address"}],"outputs":[],"stateMutability":"nonpayable"},
    {"type":"event","name":"OwnershipTransferred","inputs":[{"name":"previousOwner","type":"address","indexed":true,"internalType":"address"},{"name":"newOwner","type":"address","indexed":true,"internalType":"address"}],"anonymous":false},
    {"type":"event","name":"PriceFeedUpdated","inputs":[{"name":"asset","type":"address","indexed":true,"internalType":"address"},{"name":"priceId","type":"bytes32","indexed":true,"internalType":"bytes32"}],"anonymous":false},
    {"type":"error","name":"OwnableInvalidOwner","inputs":[{"name":"owner","type":"address","internalType":"address"}]},
    {"type":"error","name":"OwnableUnauthorizedAccount","inputs":[{"name":"account","type":"address","internalType":"address"}]}
];

export const liquidityPoolABI = [
    {"type":"constructor","inputs":[],"stateMutability":"nonpayable"},
    {"type":"function","name":"deposit","inputs":[{"name":"amount","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},
    {"type":"function","name":"withdraw","inputs":[{"name":"amount","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},
    {"type":"function","name":"getBalance","inputs":[{"name":"user","type":"address","internalType":"address"}],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},
    {"type":"function","name":"getTotalSupply","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},
    {"type":"function","name":"getTotalBorrowed","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"}
]