import jsonwebtoken from 'jsonwebtoken';
import { SignOptions, Secret } from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

interface JwtHeader {
    kid: string;
    alg: string;
}

export class JitsiTokenService {
    private static privateKey: Secret;
    private static appId: string;
    private static kid: string;

    static initialize(config: { privateKey: string; appId: string; kid: string }) {
        try {
            this.privateKey = config.privateKey
            this.appId = config.appId;
            this.kid = config.kid;

            console.log(`APP ID: ${this.appId}`);
            console.log(`KID API KEY: ${this.kid}`);
            console.log(`PRIVATE KEY: ${this.privateKey}`);

        } catch (error) {
            console.error('Failed to initialize JitsiTokenService:', error);
            throw new Error('Failed to load private key');
        }
    }



    static generateMeetingToken(roomName: string, userData: { name: string; email: string; avatar?: string }): string {
        if (!this.privateKey || !this.appId || !this.kid) {
            throw new Error('JitsiTokenService not initialized');
        }


        const now = new Date();
        const payload = {
            aud: 'jitsi',
            context: {
                user: {
                    id: uuidv4(),
                    name: userData.name,
                    avatar: userData.avatar,
                    email: userData.email,
                    moderator: 'true'
                },
                features: {
                    livestreaming: 'true',
                    recording: 'true',
                    transcription: 'true',
                    "outbound-call": 'true'
                }
            },
            iss: 'chat',
            room: roomName,
            sub: this.appId,
            exp: Math.round(now.setHours(now.getHours() + 3) / 1000),
            nbf: (Math.round((new Date).getTime() / 1000) - 10)
        };

        const options: SignOptions & { header: JwtHeader } = {
            algorithm: 'RS256',
            header: {
                kid: this.kid,
                alg: 'RS256'
            }
        };

        try {
            return jsonwebtoken.sign(payload, this.privateKey, options);
        } catch (error) {
            console.error('Token generation error:', error);
            throw new Error('Failed to generate token');
        }
    }
}