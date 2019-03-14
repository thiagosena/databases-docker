FROM mongo:3.4
 
ENV AUTH yes
ENV STORAGE_ENGINE wiredTiger
ENV JOURNALING yes
 
ADD run.sh /run.sh
ADD set_mongodb_password.sh /set_mongodb_password.sh
 
CMD ["/run.sh"]
