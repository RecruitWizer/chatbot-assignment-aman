/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        GG_ID: "211311917745-kjfkimasfgnuf9ufokst16ddahdrn8eo.apps.googleusercontent.com",
        GG_SECRET: "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",
        NEXTAUTH_SECRET: "KBUc9qzevbmYH8akRlx2z97zJftCdhJUf9bv85AzwSU=",
        NEXTAUTH_URL: "http://localhost:3000",
        REDIS_PW: "ksltoji3ZyLdTl4VrCPn4yrALZJIMu0v",
        REDIS_HOST: "redis-17736.c326.us-east-1-3.ec2.cloud.redislabs.com",
        REDIS_PORT: "17736"
    },
    experimental: {
        serverActions: true,
    }
}

module.exports = nextConfig
