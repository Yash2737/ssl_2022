Server Name : prabodham36369
Pass : Prabodham36

DB name : SSL_2022_PROD
mongodb+srv://prabodham36369:Prabodham36@prabodham.owbqxe4.mongodb.net/?retryWrites=true&w=majority

docker build -t yashsoni2737/ssl_service:latest .
docker push yashsoni2737/ssl_service:latest
docker pull yashsoni2737/ssl_service:latest
docker run -itd -p 3000:3000 --name=ssl_service yashsoni2737/ssl_service:latest

docker build -t yashsoni2737/ssl_website:latest .
docker push yashsoni2737/ssl_website:latest
docker pull yashsoni2737/ssl_website:latest
docker run -itd -p 80:80 --name=ssl_website yashsoni2737/ssl_website:latest