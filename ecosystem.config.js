module.exports = {
  apps : [{
    name: 'Huodaios_hk',
    script: 'server.js',

    // Options reference: https://pm2.keymetrics.io/docs/usage/application-declaration/
    args: 'one two',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }],

  deploy : {
    production : {
      user : 'root',                                                             //也可以useradd另建用户
      host : '447.240.4.209',     
      ssh_options: [
        'Port=80',
      ],                                           // 服务器地址
      ref  : 'huodaiOs/master',
      repo : 'git@github.com:wqmer/huodaiOS_hongKong_middle.git',            // github上的项目地址
      path : '/home/HuodaiOS_Middle_v3/deploy',                                                //  服务器上放项目的目录
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production'
    }
  }
};