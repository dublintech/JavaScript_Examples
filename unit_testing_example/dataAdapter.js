var dublintech = dublintech || {};

dublintech.dataAdapter = (function() {		
	function adaptStudents(data) {
		var adaptedStudentsVar = {
			students:[]
		};
		
		jQuery.each(data.students, function(indx, originalStudent){
			var student = {
				name: originalStudent.firstName + " " + originalStudent.lastName,
				dateOfBirth: originalStudent.dateOfBirth,
				nationality: originalStudent.nationality
			};
			adaptedStudentsVar.students.push(student);
		});
		return adaptedStudentsVar;
	}
   
    var that = {};
	that.adaptStudents = adaptStudents;  
    return that;
});