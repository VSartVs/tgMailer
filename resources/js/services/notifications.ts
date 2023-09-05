import Swal from 'sweetalert2/dist/sweetalert2'

export default class CustomNotification {
    static swalMessage = (icon = 'success', title = '') => {
        Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        }).fire({
            title: title,
            icon: icon,
        })
    }

    static actionModal = (icon = 'warning',
                          title = 'Вы действительно хотите удалить запись?',
                          text = 'Отменить действие будет невозможно.',
                          successText = 'Запись успешно удалена',
                          errorText = 'Удаление отменено'
    ) => {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: 'btn btn-success text-white',
                cancelButton: 'btn btn-danger text-white',
                actions: 'gap-2',
            },
            buttonsStyling: false
        })

        return swalWithBootstrapButtons.fire({
            title: title,
            text: text,
            icon: icon,
            showCancelButton: true,
            confirmButtonText: 'Да!',
            cancelButtonText: 'Нет, отменить!',
            reverseButtons: true
        }).then(async (result) => {
            if (result.isConfirmed) {
                await swalWithBootstrapButtons.fire(
                    'Успех!',
                    successText,
                    'success'
                )
            }
            else if (result.dismiss === Swal.DismissReason.cancel) {
                await swalWithBootstrapButtons.fire(
                    'Отмена!',
                    errorText,
                    'error'
                )
            }
            return Promise.resolve(result)
        })
    }
}


