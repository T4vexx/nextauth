import type { NextPage } from 'next'
import { useContext, useEffect } from 'react'
import { Can } from '../components/Can'
import { AuthContext } from '../contexts/AuthContext'
import { useCan } from '../hooks/useCan'
import { setupAPIClient } from '../services/api'
import { api } from '../services/apiClient'
import { withSSRAuth } from '../utils/withSSRAuth'

const Dashboard: NextPage = () => {
  const { user, signOut } = useContext(AuthContext)

  const userCanSeeMetrics = useCan({
    roles: ['administrator','editor']
  })

  useEffect(() => {
    api.get('/me').then(response => console.log(response)).catch(err => console.error(err))
  }, [])

  return (
    <>
      <h1>Dashboard: {user?.email}</h1>

      <button onClick={signOut}>Sign Out</button>

      { userCanSeeMetrics && <div>Métricas</div>}

      <Can permissions={['metrics.list']}>
        <div>Métricas2</div>
      </Can>
    </>
  )
}

export default Dashboard

export const getServerSideProps = withSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx);
  const response = await apiClient.get('/me');

  return {
    props: {

    }
  }
})