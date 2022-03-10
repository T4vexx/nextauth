import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next"
import { destroyCookie, parseCookies } from "nookies"
import decode from 'jwt-decode'
import { validateUserPermissions } from "./validateUserPermissions";

type WithSSROption = {
    permissions?: string[];
    roles?: string[];
}

export function withSSRAuth<p>(fn: GetServerSideProps<p>, options?:WithSSROption): GetServerSideProps {
    return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<p>> => {
        const cookies = parseCookies(ctx)
        const token = cookies['nextauth.token']

        if (!token) {
            return {
                redirect: {
                    destination: '/',
                    permanent: false
                }
            }
        }

        if (options) {
            const user = decode<{ permissions: string[], roles: string[] }>(token)
            const { permissions, roles } = options
            console.log(user)

            const useHasValidPermissions = validateUserPermissions({
                user,
                permissions,
                roles 
            })

            if(!useHasValidPermissions) {
                return {
                    redirect: {
                        destination: '/dashboard',
                        permanent: false,
                    } 
                }
            }
        }

        try { 
            return await fn(ctx)
        } catch (err) {
            if (err instanceof Error) {
                destroyCookie(ctx, 'nextauth.token')
                destroyCookie(ctx, 'nextauth.refreshToken')
                return {
                    redirect: {
                        destination: '/',
                        permanent: false,
                    }
                }
            }
        } 
    }
}