# Extract tweets through web scraping
This project extracts tweets by using the [Puppeteer](https://pptr.dev/) Node.js library and save them in *.csv* file. 
> Note: [Node.js](https://nodejs.org/es) is required.

## Run scraping
First, install all dependencies by running:
```bash
npm install
```
Then, to run the script execute:
```bash
node src/tweetScraping.js USERNAME PASSWORD "TWEET QUERY" MIN_TWEETS
```
where:
- `USERNAME` is the *twitter username* to log in,
- `PASSWORD` is the *twitter password* to log in, 
- `"TWEET QUERY"` is the query that searchs for tweets,
- `MIN TWEETS` is an estimated tweet number you want to get (optional. Default to 200)

## Example

For example, if you want to get tweets related to "*franco colapinto*":
```bash
node src/tweetScraping.js elonmusk adminPass "franco colapinto" 100
```
A *tweets.csv* file will be created. It will look like this:
Username | Datetime | Tweet
:---: | :---: | :---: |
@NachoB29 | 2023-09-29T01:56:40.000Z | Quizas sea de franco colapinto?  Va no creo  Que pensas @Colapinto_news? 
@Daniel_Caamano | 2023-09-28T23:54:58.000Z | ¿Franco Colapinto a la F2? Lo sabremos en pocos días.  El próximo martes se anunciará su actividad deportiva en 2024. Las negociaciones apuntan a la Fórmula 2 en JM Motorsport.  Por Daniel Panelo / #TodoFierroPrensa  #TodoFierro
@d_panelo | 2023-09-28T22:24:06.000Z | Sigamos agitando, #FranColapintoaF2! Falta poco para el anuncio.  @FranColapinto #F2 #WilliamsF1 #RoadToF1 #Motorsport #francocolapinto #WeAreWilliams #F1 #F3
@VickyDjarin | 2023-09-28T21:35:19.000Z | @Lacolapintoneta Estamos organizando un grupito para ir a hacerle el aguante a Fran el martes Se agradece difusión! #FranColapinto #FrancoColapinto #F2 #FranColapintoAF2

