import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
const Person = () => {
    // url
    const url = 'http://localhost:7000/?option='
    // src image
    const srcUrl = 'http://localhost:7000/public/uploads/'

    // preview image
    const [preview, setPreview] = useState({
        image_preview: '', image_file: null
    })

    // fuction image preview
    const handleImagePreview = (e) => {
        let images_base64 = URL.createObjectURL(e.target.files[0])
        let images_file = e.target.files[0]

        setPreview({
            image_preview: images_base64,
            image_file: images_file
        })
    }

    // autofocus input ref
    const inputRefDni = useRef()
    const inputRefNames = useRef()
    const inputRefEmail = useRef()
    // state form data person
    const [stateForm, setstateForm] = useState({
        id: '', dni: '', names: '', email: ''
    })
    // add setStateForm a form
    const { id, dni, names, email } = stateForm

    // function onInputChange of setstateForm
    const onInputChange = (e) => {
        setstateForm({
            ...stateForm,
            [e.target.name]: e.target.value
        })
    }

    // function onSubmit
    const onSubmit = (e) => {
        e.preventDefault()
        if (id === '') {
            // console.log(preview.image_file)
            // console.log(document.querySelector('input[type=file]').files[0])
            var params = new FormData()
            params.append('dni', dni)
            params.append('names', names)
            params.append('email', email)
            params.append('file', preview.image_file)
            // params.append('file', document.querySelector('input[type=file]').files[0])
            axios.post(url + 'POST', params)
                .then(res => {
                    if (res.data === true) {
                        Swal.fire({
                            title: 'Success',
                            text: 'Person added successfully',
                            icon: 'success'
                        })
                        listData()
                        cleanInputs()
                    } else if (res.data === 'DNI is already taken') {
                        Swal.fire({
                            title: 'Warning',
                            text: res.data,
                            icon: 'warning'
                        })
                        inputRefDni.current.focus()
                    } else if (res.data === 'EMAIL is already taken') {
                        Swal.fire({
                            title: 'Warning',
                            text: res.data,
                            icon: 'warning'
                        })
                        inputRefEmail.current.focus()
                    }
                })
                .catch(err => {
                    console.error(err);
                })
        } else {
            var params1 = new FormData()
            params1.append('id', id)
            params1.append('dni', dni)
            params1.append('names', names)
            params1.append('email', email)
            params1.append('file', preview.image_file)
            // params1.append('file', document.querySelector('input[type=file]').files[0])
            axios.post(url + 'PUT', params1)
                .then(res => {
                    if (res.data === true) {
                        Swal.fire({
                            title: 'Success',
                            text: 'Person updated successfully',
                            icon: 'success'
                        })
                        listData()
                        cleanInputs()
                    } else if (res.data === 'DNI is already taken') {
                        Swal.fire({
                            title: 'Warning',
                            text: res.data,
                            icon: 'warning'
                        })
                        inputRefDni.current.focus()
                    } else if (res.data === 'EMAIL is already taken') {
                        Swal.fire({
                            title: 'Warning',
                            text: res.data,
                            icon: 'warning'
                        })
                        inputRefEmail.current.focus()
                    }
                })
                .catch(err => {
                    console.error(err);
                })
        }
    }

    // function get data person for id
    const getData = (data) => {
        console.log(data.photo)
        setstateForm({
            id: data.id,
            dni: data.dni,
            names: data.names,
            email: data.email,
        })
        setPreview({
            image_preview: srcUrl + data.photo,
        })
    }

    // function delete data person for id
    const deleteData = (data) => {
        var params = new FormData()
        params.append('id', data.id)
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire(
                    'Deleted!',
                    'Your file has been deleted.',
                    'success'
                )
                if (data.status !== 'I') {
                    axios.post(url + 'DELETE', params)
                        .then(res => {
                            listData()
                        })
                        .catch(err => {
                            console.error(err);
                        })
                } else {
                    Swal.fire({
                        title: 'Error',
                        text: 'Registration is already inactive',
                        icon: 'error'
                    })
                }
            }
        })
    }

    // function clean inputs in on submit
    const cleanInputs = () => {
        setstateForm({
            id: '', dni: '', names: '', email: ''
        })
        setPreview({
            image_preview: '', image_file: null
        })
        document.getElementById('formData').reset()
        inputRefDni.current.focus()
    }

    // state list data person
    const [statePerson, setstatePerson] = useState([])
    // list data
    const listData = () => {
        axios.get(url + 'GET')
            .then(res => {
                setstatePerson(res.data)
            })
            .catch(err => {
                console.error(err);
            })
    }
    useEffect(() => {
        listData()
    }, [])
    return (
        <div>
            <div className="row">
                <div className="col-sm-3">
                    <div className="card" id='div'>
                        <div className="card-body" id="div1">
                            <h5 className="card-title">Form</h5>
                            <form id="formData" onSubmit={e => onSubmit(e)} encType="multipart/form-data">
                                <input type="hidden"
                                    name='id'
                                    value={id}
                                    onChange={e => onInputChange(e)} />
                                <div className="mb-3">
                                    <label htmlFor="dni" className="form-label">Dni</label>
                                    <input type="text"
                                        className="form-control"
                                        name="dni"
                                        minLength="10"
                                        maxLength="10"
                                        id="inputCss"
                                        value={dni}
                                        autoFocus
                                        required
                                        ref={inputRefDni}
                                        onChange={e => onInputChange(e)} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="names" className="form-label">Names</label>
                                    <input type="text"
                                        className="form-control"
                                        name="names"
                                        id="inputCss"
                                        value={names}
                                        required
                                        ref={inputRefNames}
                                        onChange={e => onInputChange(e)} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="price" className="form-label">Email</label>
                                    <input type="email"
                                        className="form-control input"
                                        name="email"
                                        id="inputCss"
                                        value={email}
                                        required
                                        ref={inputRefEmail}
                                        onChange={e => onInputChange(e)} />
                                </div>
                                <div className="mb-3">
                                    <img src={preview.image_preview} alt='' width="80"/>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="photo" className="form-label">Photo</label>
                                    <input type="file"
                                        className="form-control input"
                                        name="photo"
                                        id="inputCss"
                                        onChange={(e) => handleImagePreview(e)} />
                                </div>

                                <button type="submit" className="btn btn-primary" id="btnAdd">Add</button>
                                <button type="button" className="btn btn-success" onClick={() => cleanInputs()}>New</button>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="col-sm-9">
                    <div className="card" id="div">
                        <div className="card-body table table-responsive">
                            <h5 className="card-title text-white">List</h5>
                            <table className="table text-white">
                                <thead>
                                    <tr>
                                        <th itemScope="col">#</th>
                                        <th itemScope="col">Dni</th>
                                        <th itemScope="col">Names</th>
                                        <th itemScope="col">Email</th>
                                        <th itemScope="col">Photo</th>
                                        <th itemScope="col">Status</th>
                                        <th itemScope="col" colSpan="2">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        statePerson.map((item, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{item.dni}</td>
                                                <td>{item.names}</td>
                                                <td>{item.email}</td>
                                                <td>
                                                    <img src={srcUrl + item.photo} alt="imagen" width="50" height="50" />
                                                </td>
                                                <td>
                                                    {item.status === 'A' ? <span className="badge bg-success">Active</span> : <span className="badge bg-danger">Inactive</span>}
                                                </td>
                                                <td>
                                                    <button className="btn btn-primary btn-sm"
                                                        id="btnEdit" title="Edit"
                                                        onClick={() => getData(item)}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button className="btn btn-danger btn-sm"
                                                        title="Delete"
                                                        onClick={() => deleteData(item)}
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Person
