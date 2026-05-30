// Datos de demo cuando no hay API keys configuradas.
// Simulan un hotel real con reseñas variadas para mostrar el sistema de puntaje.

export function generarDemoData(nombre, ciudad) {
  return {
    hotel: {
      nombre: nombre || 'Hotel Demo',
      ciudad: ciudad || 'Buenos Aires',
      direccion: `Av. Corrientes 1234, ${ciudad || 'Buenos Aires'}`,
    },
    fuentes: [
      {
        fuente: 'Google',
        rating: 4.2,
        totalReseñas: 1248,
        url: '#',
        reseñas: [
          {
            autor: 'María González',
            calificacion: 5,
            texto: 'Excelente hotel, muy céntrico y bien ubicado. El personal fue increíblemente amable y servicial. Las habitaciones estaban impecables y la cama muy cómoda. El desayuno abundante con mucha variedad. La piscina limpia y tranquila. Totalmente recomendable, vale la pena cada peso.',
            fecha: 'hace 2 semanas',
          },
          {
            autor: 'Carlos Pérez',
            calificacion: 4,
            texto: 'Buena ubicación, cerca del centro y a pasos de la playa. El cuarto estaba limpio aunque un poco pequeño. El wifi funcionó bien todo el tiempo. La atención en recepción fue muy buena y amable. El desayuno estaba bien pero poca variedad. Buen precio para lo que ofrecen.',
            fecha: 'hace 1 mes',
          },
          {
            autor: 'Laura Martínez',
            calificacion: 3,
            texto: 'La ubicación es conveniente, pero el hotel tiene ciertas deficiencias. Mucho ruido por las noches, no pude dormir bien. El aire acondicionado hacía ruido. El personal fue amable pero lento. La piscina estaba sucia un día. Precio razonable para la zona.',
            fecha: 'hace 3 semanas',
          },
          {
            autor: 'Roberto Silva',
            calificacion: 5,
            texto: 'Perfecta ubicación, en el corazón de la ciudad a caminando de todo. Personal muy profesional y hospitalario. Habitaciones amplias y cómodas, cama excelente. Restaurante con comida deliciosa y buena carta. Piscina increíble. Totalmente accesible con ascensor y rampa para discapacitados. Vale la pena.',
            fecha: 'hace 5 días',
          },
          {
            autor: 'Ana Rodríguez',
            calificacion: 2,
            texto: 'Muy decepcionante. Llegamos y la habitación estaba sucia, con manchas en las sábanas. El personal fue grosero cuando reclamamos. El desayuno escaso y sin variedad. Muy caro para la calidad que ofrecen. No hay rampa de acceso. No lo recomiendo para nada.',
            fecha: 'hace 2 meses',
          },
          {
            autor: 'Diego Fernández',
            calificacion: 5,
            texto: 'Hotel increíble en zona céntrica. El staff fue excepcional, muy atentos y cordiales. Habitaciones impecables, tranquilas y cómodas. La cama es una maravilla. Desayuno delicioso con mucha variedad. WiFi rapidísimo. Estacionamiento disponible. Precio justo. Lo recomiendo ampliamente.',
            fecha: 'hace 1 semana',
          },
        ],
      },
      {
        fuente: 'TripAdvisor',
        rating: 4.0,
        totalReseñas: 876,
        url: '#',
        reseñas: [
          {
            autor: 'TravelerBCN',
            calificacion: 4,
            texto: 'Great location in the city center, walking distance to main attractions. Staff was very friendly and helpful. Room was clean and comfortable. Breakfast was good but limited options. The pool was nice and quiet. Good value for money.',
            fecha: '2024-03-15',
          },
          {
            autor: 'ViajeraBA',
            calificacion: 5,
            texto: 'Hotel espectacular. Ubicación privilegiada, céntrico y a metros de la playa. Personal amabilísimo y muy profesional. Habitaciones impecables, silenciosas y con excelente climatización. Restaurante con comida rica y variada. Piscina limpia y bien mantenida. Accesible para personas con movilidad reducida. Precio muy conveniente.',
            fecha: '2024-03-10',
          },
          {
            autor: 'Backpacker_EU',
            calificacion: 3,
            texto: 'Decent hotel but overpriced. Location is good but the room was small and noisy. Air conditioning was broken. Staff was unfriendly at checkout. Breakfast was bad and very limited. No gym facilities. Not worth the price they charge.',
            fecha: '2024-02-28',
          },
          {
            autor: 'FamiliaViajera',
            calificacion: 5,
            texto: 'Excelente experiencia familiar. Hotel muy limpio, personal muy atento con los niños. Habitación espaciosa y cómoda. El desayuno abundante y delicioso. La piscina perfecta. Muy bien ubicado, cerca de todo. Ascensor funcionando perfecto, ideal para familia con cochecito. Super accesible.',
            fecha: '2024-03-01',
          },
        ],
      },
      {
        fuente: 'Booking.com',
        rating: 8.4,
        totalReseñas: 2103,
        ratingMax: 10,
        url: '#',
        reseñas: [
          {
            autor: 'Patricio M.',
            calificacion: 9,
            texto: 'Muy buena experiencia. Ubicación céntrica inmejorable. Personal amable y eficiente. Habitación limpia y cómoda, cama muy buena. Desayuno muy rico y variado. Piscina limpia. WiFi excelente. Relación precio-calidad muy buena. Lo volvería a elegir.',
            fecha: '2024-03-12',
          },
          {
            autor: 'SusanaR',
            calificacion: 6,
            texto: 'Ubicación buena pero el hotel tiene problemas. El cuarto estaba con olor a humedad. El personal fue indiferente. El desayuno escaso. Precio algo caro para lo que ofrecen. No tiene estacionamiento propio. El restaurante cerrado a las 10pm que es muy temprano.',
            fecha: '2024-02-20',
          },
          {
            autor: 'JuanPablo_VIP',
            calificacion: 10,
            texto: 'Hotel de primera. En el corazón de la ciudad, accesible a todo. Personal increíblemente hospitalario y profesional. Habitaciones amplias, impecables y muy tranquilas. El restaurante con comida exquisita. Cócteles en el bar espectaculares. Spa increíble. Gym completo. Piscina de primer nivel. Totalmente accesible con rampa y ascensor. Vale cada centavo.',
            fecha: '2024-03-05',
          },
          {
            autor: 'TuristaFrugal',
            calificacion: 5,
            texto: 'Regular. La ubicación está bien, bastante céntrico. Pero la habitación era pequeña y el aire roto. Mucho ruido en las noches, no dormí bien. El desayuno sin variedad y la comida sin sabor. El personal poco predispuesto a ayudar. Para el precio que cobran es demasiado caro.',
            fecha: '2024-02-10',
          },
        ],
      },
    ],
    esDemo: true,
  }
}
