export const environment = {
  production: true,
  apiHost : "https://api.scriptchess.com",
  blogHost : "https://blog.scriptchess.com",
  imagePath:"https://scriptchess-images.s3.ap-south-1.amazonaws.com",
  cdnImagePath:"https://d3eflz0swy1hif.cloudfront.net",
  stockfishLocation:"/assets/js/scriptfish.js",
  //stockfishLocation:"http://192.168.29.19:4200/assets/js/stockfish.js",
  postsPerPage : 10,
  gameAnalysisDepth: 18,
  positionAnalysisDepth: 18,
  //training Configurations
  maxPuzzleCount : 100,
  maxPositionQuizeToComplete : 100,
  botsGamesToBePlayed : 10,
  gamesReviewsToComplete : 10,
  googleAdClientId: 'pub-1154421276196704',
  googleRedirectUrl : "http://localhost:8300/register",
  userRegistrationUrl : "http://localhost:4200/register",
  paddingString:"zq4WBESnBWMNK6OWGcyA",
  maxGameCountPerBulkAnalysis : 50

};
