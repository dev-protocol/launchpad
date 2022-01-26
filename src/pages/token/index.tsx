import { FunctionComponent, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import PageHeader from '../../components/PageHeader'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShareAlt } from '@fortawesome/free-solid-svg-icons'
import { faQuestionCircle } from '@fortawesome/free-regular-svg-icons'
import { usePropertyData } from './fetch-token-data.hook'

interface TokenProps {}

const Token: FunctionComponent<TokenProps> = () => {
  const { hash } = useParams()
  const [assetName, setAssetName] = useState('')
  const [assetSymbol, setAssetSymbol] = useState('')
  const { propertyData, error } = usePropertyData(hash)

  useEffect(() => {
    console.log('property data updated: ', propertyData)
    if (!propertyData) {
      return
    }
    ;(async () => {
      setAssetSymbol(await propertyData.symbol())
      setAssetName(await propertyData.name())
    })()
  }, [propertyData])

  return (
    <div className="flex flex-col">
      {propertyData && (
        <>
          <div className="flex justify-between items-center">
            <PageHeader title={assetSymbol} styleOverride={{ 'margin-bottom': '0.5rem' }} />
            <div className="mb-2">
              <FontAwesomeIcon icon={faShareAlt} style={{ color: '#333' }} />
            </div>
          </div>
          <div className="font-bold">{hash}</div>
          <div className="flex justify-between">
            <div className="flex">
              {/** TODO: dynamic icon depending on market */}
              <FontAwesomeIcon icon={faGithub} size="xs" className="mr-1" style={{ color: '#e93323' }} />
              <span>{assetName}</span>
              <link></link>
            </div>
            <div>
              <Link to="#">
                <FontAwesomeIcon icon={faQuestionCircle} />
              </Link>
            </div>
          </div>
        </>
      )}
      {error && <div className="text-red-500">{error}</div>}
    </div>
  )
}

export default Token
