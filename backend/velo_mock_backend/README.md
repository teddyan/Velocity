# Lumen PHP Framework

[![Build Status](https://travis-ci.org/laravel/lumen-framework.svg)](https://travis-ci.org/laravel/lumen-framework)
[![Total Downloads](https://poser.pugx.org/laravel/lumen-framework/d/total.svg)](https://packagist.org/packages/laravel/lumen-framework)
[![Latest Stable Version](https://poser.pugx.org/laravel/lumen-framework/v/stable.svg)](https://packagist.org/packages/laravel/lumen-framework)
[![License](https://poser.pugx.org/laravel/lumen-framework/license.svg)](https://packagist.org/packages/laravel/lumen-framework)

Laravel Lumen is a stunningly fast PHP micro-framework for building web applications with expressive, elegant syntax. We believe development must be an enjoyable, creative experience to be truly fulfilling. Lumen attempts to take the pain out of development by easing common tasks used in the majority of web projects, such as routing, database abstraction, queueing, and caching.

## Official Documentation

Documentation for the framework can be found on the [Lumen website](https://lumen.laravel.com/docs).

## Contributing

Thank you for considering contributing to Lumen! The contribution guide can be found in the [Laravel documentation](https://laravel.com/docs/contributions).

## Security Vulnerabilities

If you discover a security vulnerability within Lumen, please send an e-mail to Taylor Otwell at taylor@laravel.com. All security vulnerabilities will be promptly addressed.

## License

The Lumen framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
## 安装必须的软件 （以下所有项目都配在windows环境下）  
Git命令  
1：进入git官网地址：https://git-scm.com/download/win ，下载windows版安装包

XAMPP:  
1:下载XAMPP  
2:安装  
3：更新window环境配置，右键我的电脑->属性->环境变量->系统变量->Path->新建->填入xxx(xampp路径):/xampp/php/ ->确认(本操作用于配置php环境)    

Composer  
1:下载地址-----https://getcomposer.org/Composer-Setup.exe  
2：下载完毕后双击即可


## 环境配置
1：git clone 整个仓库，然后进入到velo_mock_bankend 根目录下  
2：在根目录下，使用命令composer update 获取依赖  
3: 将我的.env文件覆盖默认的根目录下的.env文件  
4：使用命令 php -S localhost:8000 -t public 进行启动项目，然后项目已启动，访问端口为8000  

##定时工具脚本 使用说明
1：VIP自动发券功能  
1）执行代码在/app/Console/Command/VIPManagement.php中，里面handle为对应处理方式  
2）同时，Kerenel.php中注册对应的命令，在command写入 \App\Console\Commands\VIPManagement::class,然后在Schedule中完成对应的时间间隔设置everyminiue

使用方法：  
1)在服务器中之执行命令:crontab -e  
2）在文件中输入* * * * *  php地址/php 项目地址/artisan schedule:run  
3）保存  
4）使用crontab -l查看是否有这个命令在执行  
5）done