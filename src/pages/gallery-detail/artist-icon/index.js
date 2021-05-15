import { Button } from '../../../components/button'
import { PATH } from '../../../constants'
import { ArtistSocials } from '../../../components/artist-socials'
import styles from './styles.module.scss'

export const ArtistLogo = ({
  wallet,
  name,
  site,
  telegram,
  twitter,
  instagram,
  github,
  reddit,
}) => {
  //<Button to={`${PATH.ISSUER}/${wallet}`}>
  return (
    <div className={styles.artist}>
      {wallet && (
        <Button to={`${PATH.ISSUER}/${wallet}`}>
          <div className={styles.icon}>
            <img
              src={`https://services.tzkt.io/v1/avatars2/${wallet}`}
              alt="profile"
            />
          </div>
        </Button>
      )}
      <div className={styles.text}>
        {name && (
          <Button to={`${PATH.ISSUER}/${wallet}`}>
            <p>
              <strong>{name}</strong>
            </p>
          </Button>
        )}
        <ArtistSocials
          site={site}
          telegram={telegram}
          twitter={twitter}
          instagram={instagram}
          github={github}
          reddit={reddit}
        />
      </div>
    </div>
  )
}
