#/!bin/bash
service='dev-trb-ot-ui'
if [ $(docker ps | grep $service | wc -l) -eq 1 ];
then
	echo "$service is runnig  ....."
	echo "$service is removing  ....."
	docker kill $service && docker rm $service
	echo "$service container spin up  ....."
	docker run -itd -v /var/logs/:/opt/ -p 1015:8080 --name $service 172.18.20.44:5000/trb-ot-ui:1.0-BUILD_NUMBER
elif [ $(docker ps -a | grep $service | wc -l) -eq 1 ];
then
	echo "$service is not runnig  ....."
	echo "$service remove and start new container"
    docker rm $service
	echo "$service container spin up  ....."
	docker run -itd -v /var/logs/:/opt/ -p 1015:8080 --name $service 172.18.20.44:5000/trb-ot-ui:1.0-BUILD_NUMBER
else
	echo " $service service not running.... so exiting "
	echo "$service container spin up  ....."
	docker run -itd -v /var/logs/:/opt/  -p 1015:8080 --name $service 172.18.20.44:5000/trb-ot-ui:1.0-BUILD_NUMBER
fi 
