import React from 'react'

const TeamMembers = () => {
  const members = [
    {
      name: 'John Doe',
      rollNumber: 'CS-001',
      age: 22,
      contribution: 'Frontend Development and UI/UX Design',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face'
    },
    {
      name: 'Jane Smith',
      rollNumber: 'CS-002',
      age: 21,
      contribution: 'Backend Development and Database Management',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face'
    },
    {
      name: 'Mike Johnson',
      rollNumber: 'CS-003',
      age: 23,
      contribution: 'Project Management and Testing',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face'
    }
  ]

  return (
    <section className="bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-serif text-gray-800 text-center mb-8">Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {members.map((member, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 text-center">
              <img
                src={member.image}
                alt={member.name}
                className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
              />
              <h3 className="text-xl font-medium text-gray-800 mb-2">{member.name}</h3>
              <p className="text-gray-600 mb-1"><strong>Roll Number:</strong> {member.rollNumber}</p>
              <p className="text-gray-600 mb-1"><strong>Age:</strong> {member.age}</p>
              <p className="text-gray-600"><strong>Contribution:</strong> {member.contribution}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TeamMembers
