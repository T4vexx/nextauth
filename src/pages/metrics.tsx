import type { NextPage } from 'next'
import { setupAPIClient } from '../services/api'
import { withSSRAuth } from '../utils/withSSRAuth'
import decode from 'jwt-decode'

const Metrics: NextPage = () => {
  return (
    <>
      <h1>Metrics</h1>
    </>
  )
}

export default Metrics

export const getServerSideProps = withSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx);
  const response = await apiClient.get('/me');

  return {
    props: {

    }
  }
}, {
    permissions: ['metrics.list'],
    roles: ['administrator']
})