# Criando maquina oracle com docker
Acessar o docker storage do oracle e fazer checkout
https://hub.docker.com/_/oracle-database-enterprise-edition/purchase?plan=08cf8677-bb8f-453c-b667-6b0c24a388d4

## Baixar o container

```bash
docker pull store/oracle/database-enterprise:12.2.0.1
```

## Executar a imagem

```bash
docker run -d -p 1521:1521 --name oracle store/oracle/database-enterprise:12.2.0.1
```

## Acessar o sqlplus
Aguarde um pouco o processo anterior até o conteiner iniciar completamente __(mais ou menos 3 minutos)__.

```bash
docker exec -it oracle bash -c "source /home/oracle/.bashrc; sqlplus /nolog"
```

## Alterar a sessão e o usuario system
user: sys
password: Oradoc_db1

```bash
connect sys as sysdba;
alter session set "_ORACLE_SCRIPT"=true;
alter user system identified by system;
```

# Efetuar o import
No sql developer, criar uma nova conexão e inserir os dados:

```bash
username: system
password: system
hostname: localhost
port: 1521
Service name: ORCLCDB.localdomain
```

## Criar as seguintes tablespace:

```sql
CREATE TABLESPACE "NUCLEARIS_DADOS" DATAFILE 
  '/u02/app/oracle/oradata/ORCL/NUCLEARIS_DADOS.dbf' SIZE 5242880
  AUTOEXTEND ON NEXT 1310720 MAXSIZE 32767M
  LOGGING ONLINE PERMANENT BLOCKSIZE 8192
  EXTENT MANAGEMENT LOCAL AUTOALLOCATE DEFAULT 
 NOCOMPRESS  SEGMENT SPACE MANAGEMENT AUTO;
   ALTER DATABASE DATAFILE 
  '/u02/app/oracle/oradata/ORCL/NUCLEARIS_DADOS.dbf' RESIZE 31457280;
  
CREATE TABLESPACE "NUCLEARIS_INDICES" DATAFILE 
  '/u02/app/oracle/oradata/ORCL/NUCLEARIS_INDICES.dbf' SIZE 5242880
  AUTOEXTEND ON NEXT 1310720 MAXSIZE 32767M
  LOGGING ONLINE PERMANENT BLOCKSIZE 8192
  EXTENT MANAGEMENT LOCAL AUTOALLOCATE DEFAULT 
 NOCOMPRESS  SEGMENT SPACE MANAGEMENT AUTO;
   ALTER DATABASE DATAFILE 
  '/u02/app/oracle/oradata/ORCL/NUCLEARIS_INDICES.dbf' RESIZE 31457280;
```

## Import dump file
Adicionar o arquivo dump no diretório: DATA_PUMP_DIR localizado na pasta "/u01/app/oracle/admin/ORCL/dpdump/" dentro do container. Caso o diretorio não exista, crie com o comando mkdir.

```sql
docker cp /d/nuclearis.dmp oracle:/u01/app/oracle/admin/ORCL/dpdump/
```

1. Criar o usuario nuclearis no sqldeveloper com o usuario sys
```sql
  ALTER SESSION SET "_ORACLE_SCRIPT"=true;  
  CREATE USER nuclearis IDENTIFIED BY nuclearis ACCOUNT UNLOCK ;
```

2. Definir as seguintes permissões para o usuario:
```sql
GRANT ALTER  INDEX TO nuclearis ;
GRANT ALTER  INDEXTYPE TO nuclearis ;
GRANT ALTER  PROCEDURE TO nuclearis ;
GRANT ALTER  SEQUENCE TO nuclearis ;
GRANT ALTER  TABLE TO nuclearis ;
GRANT ALTER  TRIGGER TO nuclearis ;
GRANT ALTER  TYPE TO nuclearis ;
GRANT CREATE INDEXTYPE TO nuclearis ;
GRANT CREATE JOB TO nuclearis ;
GRANT CREATE PROCEDURE TO nuclearis ;
GRANT CREATE SEQUENCE TO nuclearis ;
GRANT CREATE TABLE TO nuclearis ;
GRANT CREATE TRIGGER TO nuclearis ;
GRANT CREATE TYPE TO nuclearis ;
GRANT CREATE VIEW TO nuclearis ;
GRANT DEBUG  PROCEDURE TO nuclearis ;
GRANT DELETE  TABLE TO nuclearis ;
GRANT DROP  INDEXTYPE TO nuclearis ;
GRANT DROP  INDEX TO nuclearis ;
GRANT DROP  PROCEDURE TO nuclearis ;
GRANT DROP  SEQUENCE TO nuclearis ;
GRANT DROP  TABLE TO nuclearis ;
GRANT DROP  TRIGGER TO nuclearis ;
GRANT DROP  TYPE TO nuclearis ;
GRANT DROP  VIEW TO nuclearis ;
GRANT EXECUTE  PROCEDURE TO nuclearis ;
GRANT INSERT  TABLE TO nuclearis ;
GRANT SELECT  SEQUENCE TO nuclearis ;
GRANT SELECT  TABLE TO nuclearis ;
GRANT UPDATE  TABLE TO nuclearis ;
GRANT COMMENT  TABLE TO nuclearis;
GRANT UNLIMITED TABLESPACE TO nuclearis ;
GRANT CREATE SESSION to nuclearis;
```

3. Abrir a aba DBA em "View -> DBA"
4. Clicar com o botão direito do mouse em cima da pasta _Data Pump_ e clicar em Data _Pump Import Wizard_
5. Selecionar o tipo do import full, e alterar o nome do arquivo para nuclearis.dmp e seguir o passo a passo

## Se ocorrer algum problema com o SCHEMA_VERSION
1. Renomear as colunas para minusculo

```sql
ALTER TABLE NUCLEARIS.SCHEMA_VERSION RENAME COLUMN INSTALLED_RANK TO "installed_rank";
ALTER TABLE NUCLEARIS.SCHEMA_VERSION RENAME COLUMN VERSION TO "version";
ALTER TABLE NUCLEARIS.SCHEMA_VERSION RENAME COLUMN DESCRIPTION TO "description";
ALTER TABLE NUCLEARIS.SCHEMA_VERSION RENAME COLUMN TYPE TO "type";
ALTER TABLE NUCLEARIS.SCHEMA_VERSION RENAME COLUMN SCRIPT TO "script";
ALTER TABLE NUCLEARIS.SCHEMA_VERSION RENAME COLUMN CHECKSUM TO "checksum";
ALTER TABLE NUCLEARIS.SCHEMA_VERSION RENAME COLUMN INSTALLED_BY TO "installed_by";
ALTER TABLE NUCLEARIS.SCHEMA_VERSION RENAME COLUMN INSTALLED_ON TO "installed_on";
ALTER TABLE NUCLEARIS.SCHEMA_VERSION RENAME COLUMN EXECUTION_TIME TO "execution_time";
ALTER TABLE NUCLEARIS.SCHEMA_VERSION RENAME COLUMN SUCCESS TO "success";
```