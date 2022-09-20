import { FC } from "react"
import { Alert } from "react-bootstrap";

export type SystemMessageState = {
  visible: boolean
  message?: string
  type?: 'error' | 'success'
}

type Props = {
  state: SystemMessageState
  onClose: () => void
}

export const SystemMessage: FC<Props> = ({ state, onClose }) => {
  const alertVariant = state.type === 'success' ? "success" : "danger"

  return (
    <Alert variant={alertVariant} show={state.visible} onClose={onClose} dismissible>
      <Alert.Heading>{state.message}</Alert.Heading>
    </Alert>
  )
}