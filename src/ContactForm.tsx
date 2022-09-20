import { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import { useForm, SubmitHandler } from "react-hook-form";
import { ApiClient, TicketData, TicketSeverity } from "./api/apiClient";
import { SystemMessage, SystemMessageState } from "./SystemMessage";

const noticeNonFilled: string = "This field must be filled in"

export const ContactForm = () => {
    const [ticketSeverities, setTicketSeverities] = useState<TicketSeverity[] | null>(null);
    const [messageState, setMessageState] = useState<SystemMessageState>({ visible: false });
    const [sending, setSending] = useState<boolean>(false);
    const { register, handleSubmit, reset, formState: { errors } } = useForm<TicketData>();


    useEffect(() => {
        const load = async () => {
            const response = await ApiClient.getTicketSeverityList()
            if (response.error) {
                return setMessageState({ visible: true, message: response.error, type: 'error' });
            }
            setTicketSeverities(response.data);
        }
        load()
    }, [])

    const onSubmit: SubmitHandler<TicketData> = async data => {
        setSending(true);
        const result = await ApiClient.sendTicket(data);
        if (result.error) {
            setMessageState({ visible: true, message: result.error, type: 'error' });
        }
        else {
            reset();
            setMessageState({ visible: true, message: 'Contact has been successfully sent', type: 'success' });
        }
        setSending(false);
    }

    const hadleCloseAlertWindow = () => {
        setMessageState({ visible: false });
    }

    return (
        <div>
            <SystemMessage state={messageState} onClose={hadleCloseAlertWindow} />
            <Form onSubmit={handleSubmit(onSubmit)}>
                <div className='containerForm'>
                    <Container fluid>
                        <h2 >Support Ticket</h2>
                        <Row className='mb-3'>
                            <Form.Group as={Col} controlId="title.validationCustom03">
                                <Form.Label>Title*</Form.Label>
                                <Form.Control
                                    {...register("title", {
                                        required: true
                                    })}
                                    type="text"
                                    placeholder="Title of ticket"
                                    isInvalid={!!errors.title}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {noticeNonFilled}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Row>
                        <Row className='mb-3'>
                            <Form.Group as={Col} controlId="description.validationCustom03">
                                <Form.Label>Description*</Form.Label>
                                <Form.Control
                                    {...register("description", {
                                        required: true
                                    })}
                                    type="text"
                                    placeholder="Description of ticket"
                                    isInvalid={!!errors.description}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {noticeNonFilled}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Row>
                        <Row className='mb-3'>
                            <Form.Group as={Col} controlId="ticketSeverity.validationCustom03">
                                <Form.Label>Ticket Severity</Form.Label>
                                {ticketSeverities ?
                                    <Form.Select
                                        {...register("ticketSeverity", {
                                            required: true

                                        })}
                                        isInvalid={!!errors.ticketSeverity}>
                                        {
                                            ticketSeverities.map(severity => (
                                                <option value={severity.id} key={severity.code}>{severity.name}</option>

                                            ))
                                        }
                                    </Form.Select>
                                    :
                                    <div>
                                        <Spinner animation="border" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </Spinner>
                                    </div>}
                            </Form.Group>
                        </Row>
                        <p>*These data must be filled in</p>
                        <Button type="submit" disabled={sending}>Send contact</Button>
                    </Container>
                </div>
            </Form>
        </div >
    );
}