package com.steritech.resource;

import org.springframework.cloud.config.java.AbstractCloudConfig;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.data.redis.connection.RedisConnectionFactory;

/**
 * Created by erik on 8/4/15.
 */
@Configuration
@Profile("cloud")
public class CloudConfig extends AbstractCloudConfig {

    @Bean
    public RedisConnectionFactory redisConnectionFactory() {
        return connectionFactory().redisConnectionFactory();
    }

}